// agentica 불러오기
import { Agentica } from "@agentica/core";
import { OpenAI } from "openai";

// 툴
import { BasicAnalysisTool } from "./tools/BasicAnalysisTool";
import { CorrelationTool } from "./tools/CorrelationTool";
import { SelectorTool } from "./tools/SelectorTool";
import { VisualizationTool } from "./tools/VisualizationTool";
import { PreprocessingTool } from "./tools/PreprocessingTool";
import { WorkflowTool } from "./tools/WorkflowTool";
import { MachineLearningTool } from "./tools/MachineLearningTool";
// 필요시 CorrelationTool도 import

// 기타
import typia from "typia";
import readline from "readline";
import dotenv from "dotenv";
import fs from "fs";

// [ADD] 최소 변경: 식별자 생성을 위해 path/crypto만 추가
import path from "path";            // [ADD]
import crypto from "crypto";        // [ADD]

const originalConsoleLog = console.log;
console.log = (...args: any[]) => {
  if (args[0]?.includes("injecting env")) return;
  originalConsoleLog(...args);
};

dotenv.config();

// ─────────────────────────────────────────────────────────────
// 한국어 강제 가드
function isMostlyKorean(text: string, threshold = 0.4) {
  const hangul = (text.match(/[가-힣]/g) || []).length;
  const letters = (text.match(/[A-Za-z가-힣]/g) || []).length || 1;
  return hangul / letters >= threshold;
}

async function forceKoreanOnly(openai: OpenAI, text: string): Promise<string> {
  const sys = `너는 편집 도우미다. 규칙:
1) 출력은 한국어 문장만. 영어 문장/제목 금지.
2) 코드블록(\`\`\`)과 인라인 코드(\`...\`)는 원문 그대로.
3) 표(마크다운 테이블)는 구조 유지, 셀의 자연어만 한국어로.
4) 파일 경로/컬럼명/함수명/매개변수/키/에러키워드는 원문 유지 가능.
5) 불필요한 서론/후기 금지.`;
  const usr = `다음 텍스트를 위 규칙으로 한국어만 남기고 정리해줘:\n\n${text}`;
  const resp = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      { role: "system", content: sys },
      { role: "user", content: usr },
    ],
    temperature: 0.2,
  });
  return resp.choices[0]?.message?.content?.trim() || text;
}

// ─────────────────────────────────────────────────────────────
// 세션 메모리 (간단 버전)
type HistoryJson = any;
const SESSIONS = new Map<string, HistoryJson[]>();
function loadHistories(k: string) { return SESSIONS.get(k) ?? []; }
function saveHistories(k: string, prompts: any[]) {
  const prev = SESSIONS.get(k) ?? [];
  const delta = prompts
    .map((p) => (typeof p?.toJSON === "function" ? p.toJSON() : p))
    .filter((h: any) => h?.type === "text" || h?.type === "describe");
  SESSIONS.set(k, [...prev, ...delta]);
}



// ─────────────────────────────────────────────────────────────
// [ADD] 아주 작은 유틸만 추가: 세션/런 식별자 파생(리팩 최소화)
function sha1(x: string) {
  return crypto.createHash("sha1").update(x).digest("hex").slice(0, 16);
}
function safeStat(p?: string) {
  try {
    if (!p) return { size: 0, mtimeMs: 0 };
    const s = fs.statSync(p);
    return { size: s.size, mtimeMs: s.mtimeMs };
  } catch { return { size: 0, mtimeMs: 0 }; }
}
/** 
 * 기존: sessionKey = argSession || (csv ? `local:${csv}` : "local:default")
 * 변경: sessionKey = argSession || `sess_${datasetId}`  (chat/workflow 동일 세션 유지)
 *      runId는 workflow 모드에서만 필요.
 */
function deriveIds(csvFilePath?: string, argSession?: string) {   // [ADD]
  const { size, mtimeMs } = safeStat(csvFilePath);
  const datasetId = csvFilePath
    ? `ds_${sha1([path.basename(csvFilePath), size, mtimeMs].join("|"))}`
    : "ds_default";
  const sessionKey = argSession || `sess_${datasetId}`;
  const runId = `run_${Date.now()}`;
  return { datasetId, sessionKey, runId };
}

// ─────────────────────────────────────────────────────────────
// 채팅 모드 시스템 프롬프트
const CHAT_SYSTEM = `
당신은 CSV 분석 챗봇입니다.

언어 정책(매우 중요):
- 모든 출력은 반드시 **한국어(ko-KR)** 로만 작성합니다.
- 고유명사/코드/함수명/컬럼명/파일경로/매개변수/오류키워드 등은 원문 유지 가능.
- 그 외 설명·해설·표제·요약은 전부 한국어로 작성합니다.
- 영어 문장이나 영어 제목(예: "Key Observations", "Summary")이 섞였다고 판단되면,
  스스로 한국어로 즉시 바로잡아 최종 출력에는 한국어만 남기세요.

아래 도구를 상황에 맞게 사용해 한국어로 간결히 답하세요.
- BasicAnalysisTool: 컬럼 요약/결측치/기초통계
- SelectorTool: 컬럼 추천/페어 추천/전처리 권고
- CorrelationTool: 상관계수/다중공선성/히트맵
- VisualizationTool: 단/이변량 시각화
- PreprocessingTool: 결측/스케일링/인코딩 수행
- MachineLearningTool: 추천 모델 학습/평가

지침:
1) 툴이 필요한 질문이면 해당 툴을 호출해 결과를 바탕으로 답하세요.
2) 원시 JSON은 덤프하지 말고 **한국어** 요약으로 전환하세요.
3) 생성된 파일 경로는 백엔드가 UI에 뿌립니다.
4) 모호하면 간단히 가정하고 진행하세요.
`;

// ─────────────────────────────────────────────────────────────
async function main() {
  // 인자 파싱
  // 사용 예) ts-node src/main.ts --mode=workflow "분석해줘" /path/to.csv sessionA
  //       또는 ts-node src/main.ts --mode=chat "품질에 영향 큰 변수?"
  const args = process.argv.slice(2);
  const modeArgIdx = args.findIndex(a => a.startsWith("--mode="));
  const mode = modeArgIdx >= 0 ? args[modeArgIdx].split("=")[1] : "chat"; // 기본 chat
  const rest = args.filter((_, i) => i !== modeArgIdx);

  const userMessage = rest[0] || "";
  const csvFilePath = rest[1];
  const argSession = rest[2];

  // const sessionKey = argSession || (csvFilePath ? `local:${csvFilePath}` : "local:default");
  // [CHG] 세션키 파생 로직을 공통화(모드/파일 변동과 무관하게 대화 스코프 유지)
  const { sessionKey } = deriveIds(csvFilePath, argSession);    // [CHG]
  const histories = loadHistories(sessionKey);

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const agent = new Agentica({
    model: "chatgpt",
    vendor: { model: "gpt-4.1-mini", api: openai },
    controllers: [
      {
        name: "기초 분석 도구",
        protocol: "class",
        application: typia.llm.application<BasicAnalysisTool, "chatgpt">(),
        execute: new BasicAnalysisTool(),
      },
      {
        name: "컬럼 선택 도구",
        protocol: "class",
        application: typia.llm.application<SelectorTool, "chatgpt">(),
        execute: new SelectorTool(),
      },
      {
        name: "전처리 도구",
        protocol: "class",
        application: typia.llm.application<PreprocessingTool, "chatgpt">(),
        execute: new PreprocessingTool(),
      },
      {
        name: "시각화 도구",
        protocol: "class",
        application: typia.llm.application<VisualizationTool, "chatgpt">(),
        execute: new VisualizationTool(),
      },
      {
        name: "머신러닝 도구",
        protocol: "class",
        application: typia.llm.application<MachineLearningTool, "chatgpt">(),
        execute: new MachineLearningTool(),
      },
      {
        name: "상관관계 도구",
        protocol: "class",
        application: typia.llm.application<CorrelationTool, "chatgpt">(),
        execute: new CorrelationTool(),
      },                
    ],
    histories,
  });

  // ── REPL 보조
    // REPL 모드
  if (process.argv.includes("--interactive")) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const ask = () => rl.question("> ", async (line) => {
      const prompt = `### SYSTEM\n${CHAT_SYSTEM}\n\n### USER\n(아래 질문에 한국어로만 답하세요)\n${line}`;
      const answers = await agent.conversate(prompt);
      saveHistories(sessionKey, answers);
      for (const ans of answers) if ("text" in ans && ans.text) {
        let out = ans.text;
        if (!isMostlyKorean(out)) out = await forceKoreanOnly(openai, out);
        console.log(out);
      }
      ask();
    });
    console.log(`🗂 sessionKey=${sessionKey}`);
    return ask();
  }


  // ─────────────────────────────────────────────────────────
  // 모드 분기
  // ─────────────────────────────────────────────────────────

  if (mode === "workflow") {
    // 워크플로 모드: 마커 JSON 한 번만 출력
    if (!csvFilePath) throw new Error("workflow 모드에는 CSV 경로가 필요합니다.");

    // (선택) 파일 확인
    try { fs.readFileSync(csvFilePath, "utf-8"); } catch { /* ignore */ }


    // [ADD] 워크플로 시작 이벤트를 동일 세션 히스토리에 남김(채팅 패널 유지)
    const { datasetId, sessionKey: sessK, runId } = deriveIds(csvFilePath, argSession); // [ADD]
    const startEvent = {
      type: "describe",
      role: "user",
      text: `워크플로 실행 요청: file=${csvFilePath}, run=${runId}`,
      ts: Date.now()
    }; // [ADD]
    saveHistories(sessK, [startEvent]); // [ADD]



    const workflow = new WorkflowTool();

    // [ADD] 세션/런 기준 출력 루트 생성 후 전달
    const userIdFolder = "anon"; // 로그인 없음 가정, 추후 쿠키/토큰으로 교체 가능
    const outputRoot = path.join("outputs", userIdFolder, datasetId, sessK, "runs", runId); // [ADD]

    const result = await workflow.run({ filePath: csvFilePath, outputRoot } as any); // [CHG]

    // [ADD] 결과 한국어 요약을 동일 세션에 기록(채팅 패널에서 즉시 보임)
    let summary = `워크플로 완료 (run=${runId}). 산출물 키: ${Object.keys(result ?? {}).join(", ")}`;
    if (!isMostlyKorean(summary)) summary = await forceKoreanOnly(openai, summary);
    const assistantMsg = { type: "text", role: "assistant", text: summary, ts: Date.now() };
    saveHistories(sessK, [assistantMsg]); // [ADD]



    // FastAPI가 파싱할 유일한 stdout
    console.log("<<<WORKFLOW_JSON_START>>>");
    console.log(JSON.stringify({
      sessionKey: sessK,                    // [ADD]
      runId,                                // [ADD]
      datasetId,                            // [ADD]
      workflow: result,
      chatDelta: [                          // [ADD]
        { role: "user", text: startEvent.text, ts: startEvent.ts },
        assistantMsg
      ]
    }));    console.log("<<<WORKFLOW_JSON_END>>>");
    return;
  }

  // 기본: chat 모드
  {
    let prompt = `### SYSTEM\n${CHAT_SYSTEM}\n\n### USER\n(아래 요청에 한국어로만 답하세요)\n${userMessage}`;
    if (csvFilePath) prompt += `\n\n### CONTEXT\nCSV_FILE_PATH=${csvFilePath}`;

    const answers = await agent.conversate(prompt);
    saveHistories(sessionKey, answers);

    for (const ans of answers) if ("text" in ans && ans.text) {
      let out = ans.text;
      if (!isMostlyKorean(out)) out = await forceKoreanOnly(openai, out);
      console.log(out);
    }
  }

}

main().catch(console.error);
