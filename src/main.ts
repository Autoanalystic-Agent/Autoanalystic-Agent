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
import { AgentController } from "./agent/AgentController";
import typia from "typia";
import readline from "readline";
import dotenv from "dotenv";
import fs from "fs";

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
- MachineLearningTool: 추천 모델 머신러닝 학습/평가

지침:
1) 툴이 필요한 질문이면 해당 툴을 호출해 결과를 바탕으로 답하세요.
2) 원시 JSON은 덤프하지 말고 **한국어** 요약으로 전환하세요.
3) 생성된 파일 경로는 백엔드가 UI에 뿌립니다.
4) 모호하면 간단히 가정하고 진행하세요.
`;

type Slots = {
  basic?: any;
  corr?: any;
  selector?: any;
};
const SESSION_SLOTS = new Map<string, Slots>();
const getSlots = (k: string) => {
  if (!SESSION_SLOTS.has(k)) SESSION_SLOTS.set(k, {});
  return SESSION_SLOTS.get(k)!;
};

function safeParse<T=any>(v: any): T | undefined {
  if (v == null) return undefined;
  if (typeof v === "string") {
    try { return JSON.parse(v) as T; } catch { return undefined; }
  }
  return v as T;
}


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
  const sessionId = rest[2];     // FastAPI에서 전달된 sessionId

  const sessionKey = argSession || (csvFilePath ? `local:${csvFilePath}` : "local:default");
  const histories = loadHistories(sessionKey);

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const agent = new Agentica({
    model: "chatgpt",
    vendor: { model: "gpt-4.1-mini", api: openai },
    controllers: [
      {
        name: "머신러닝 도구",
        protocol: "class",
        application: typia.llm.application<MachineLearningTool, "chatgpt">(),
        execute: new MachineLearningTool(),
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
        name: "상관관계 도구",
        protocol: "class",
        application: typia.llm.application<CorrelationTool, "chatgpt">(),
        execute: new CorrelationTool(),
      },
      {
        name: "기초 분석 도구",
        protocol: "class",
        application: typia.llm.application<BasicAnalysisTool, "chatgpt">(),
        execute: new BasicAnalysisTool(),
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

    const workflow = new WorkflowTool();
    const result = await workflow.run({ filePath: csvFilePath }, {sessionId});

    // FastAPI가 파싱할 유일한 stdout
    console.log("<<<WORKFLOW_JSON_START>>>");
    console.log(JSON.stringify({ workflow: result }));
    console.log("<<<WORKFLOW_JSON_END>>>");
    return;
  }

  // 기본: chat 모드
  const controller = new AgentController();
  const reply = (text: string) => {
    console.log(text);
    return;
  };
  {
    let prompt = `### SYSTEM\n${CHAT_SYSTEM}\n\n### USER\n(아래 요청에 한국어로만 답하세요)\n${userMessage}`;
    if (csvFilePath) prompt += `\n\n### CONTEXT\nCSV_FILE_PATH=${csvFilePath} \n SESSIONID=${sessionId}`;

    

    // 🔒 라우팅 힌트만 주입(조기 return 없음) ← 여기 추가
    if (/모델|예측|학습/.test(userMessage)) {
      prompt += `
    ### ROUTE (HARD)
    - 반드시 **MachineLearningTool**만 호출하세요.
    - **BasicAnalysisTool/SelectorTool/VisualizationTool/CorrelationTool/PreprocessingTool** 호출 금지.
    - 위반 시 "routing_error" 라고만 답하세요.
    `;
    }
    if (/시각화/.test(userMessage)) {
      prompt += `
    ### ROUTE (HARD)
    - 반드시 **VisualizationTool**만 호출하세요.
    - **BasicAnalysisTool/SelectorTool/MachineLearningTool/CorrelationTool/PreprocessingTool** 호출 금지.
    - 위반 시 "routing_error" 라고만 답하세요.
    `;
    }


    let finalText = "";

    // ➊ 중간 과정(선택/호출/실행) 이벤트를 UI로 내보내려면 마커로 찍기
    agent.on("select", (e) => {
      console.log("<<<AGENT_EVENT>>>", JSON.stringify({
        type: "select",
        operation: e.selection.operation?.name,
        // e.selection에는 최종 선택만 들어있음. 후보 리스트가 필요하면 executor 커스텀 유지
      }));
    });

    agent.on("call", (e) => {
      const op = e.operation?.name ?? "";
      const args = (e.arguments ?? {}) as any;
      const slots = getSlots(sessionKey);


      // ① Selector 호출 시: null 인자 정리
      const isSelectorCall =
        /SelectorTool|컬럼\s*선택\s*도구/i.test(op) || Array.isArray(args?.columnStats);
      if (isSelectorCall && args.correlationResults === null) {
        delete args.correlationResults;
        e.arguments = args;
      }

      // ② VisualizationTool 감지 보강 (_3_run 포함)
      const isVizCall =
        /VisualizationTool|시각화\s*도구/i.test(op) || /_3_run$/.test(op);

      if (isVizCall) {
        // slots 우선
        let sel = safeParse(slots.selector) ?? slots.selector;

        // slots 없으면 세션 컨텍스트 폴백
        if (!sel || !sel.selectedColumns) {
          const selCtx = controller.getSelectorData(sessionId);
          if (selCtx) {
            sel = {
              selectedColumns: selCtx.selectedColumns,
              recommendedPairs: selCtx.recommendedPairs,
            };
          }
        }

        if (!args.selectorResult && sel?.selectedColumns && sel?.recommendedPairs) {
          args.selectorResult = {
            selectedColumns: sel.selectedColumns,
            recommendedPairs: sel.recommendedPairs,
          };
        }
        if (!args.sessionId) args.sessionId = sessionId;

        e.arguments = args;
      }

      // ③ MachineLearningTool 감지 보강 (_4_run 포함)
      const isMLCall =
        /MachineLearningTool|머신러닝\s*도구/i.test(op) || /_4_run$/.test(op);

      if (isMLCall) {
        let sel = safeParse(slots.selector) ?? slots.selector;

        // slots 없으면 세션 컨텍스트 폴백
        if (!sel || (!sel.targetColumn && !sel.problemType)) {
          const selCtx = controller.getSelectorData(sessionId);
          if (selCtx) {
            sel = {
              targetColumn: selCtx.targetColumn,
              problemType: selCtx.problemType,
              mlModelRecommendation: selCtx.mlModelRecommendation ?? null,
            };
          }
        }

        if (!args.selectorResult) args.selectorResult = {};
        if (sel) {
          args.selectorResult.targetColumn = sel.targetColumn ?? args.selectorResult.targetColumn ?? null;
          args.selectorResult.problemType = sel.problemType ?? args.selectorResult.problemType ?? null;
          args.selectorResult.mlModelRecommendation =
            sel.mlModelRecommendation ?? args.selectorResult.mlModelRecommendation ?? null;
        }
        if (!args.sessionId) args.sessionId = sessionId;

        e.arguments = args;
      }



      console.log("<<<AGENT_EVENT>>>", JSON.stringify({
        type: "call",
        id: e.id,
        operation: op,
        arguments: e.arguments,
      }));
    });

    // [ADDED] 실행 직후: 툴 결과 저장
    agent.on("execute", (e) => {
      const op = e.operation?.name ?? "";
      const value = safeParse(e.value) ?? e.value;
      const args = (e.arguments ?? {}) as any;
      const slots = getSlots(sessionKey);
      const isSelectorExec =
        /SelectorTool|컬럼\s*선택\s*도구/i.test(op) || Array.isArray(args?.columnStats);

      if (isSelectorExec && value?.selectedColumns && value?.recommendedPairs) {
        slots.selector = value;
        controller.saveSelectorData(sessionId, value, csvFilePath);
        console.log("<<<AGENT_EVENT>>>", JSON.stringify({
          type: "saved_selector",
          sessionId,
          target: value?.targetColumn,
          problemType: value?.problemType
        }));
      }

      if (/기초\s*분석\s*도구|BasicAnalysisTool/i.test(op)) {
        slots.basic = value;
      }
      if (/상관|CorrelationTool/i.test(op)) {
        slots.corr = value;
      }
      if (/컬럼\s*선택\s*도구|SelectorTool/i.test(op)) {
        slots.selector = value;
      }

      console.log("<<<AGENT_EVENT>>>", JSON.stringify({
        type: "execute",
        id: e.id,
        operation: op,
        arguments: e.arguments,
        value: e.value, // 툴 반환값(원본)
      }));
    });

    // ➋ describer 스트림 받아서 텍스트 토큰 합치기 (마크다운 최종 출력용)
    agent.on("describe", async (e) => {
      for await (const chunk of e.stream) {
        finalText += chunk;               // 최종 MD에 합침
        // 원하면 토큰도 중간중간 뿌릴 수 있음
        // console.log("<<<AGENT_EVENT>>>", JSON.stringify({ type:"describe:chunk", text: chunk }));
      }
    });

    await agent.conversate(prompt);

    // 한국어 보정(옵션)
    if (!isMostlyKorean(finalText)) {
      finalText = await forceKoreanOnly(openai, finalText);
    }

    // ✅ 콘솔 출력은 "마크다운 한 덩어리"만
    console.log(finalText.trim());
    saveHistories(sessionKey, [{ type: "text", text: finalText }]); 
  }

}

main().catch(console.error);
