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

const originalConsoleLog = console.log;
console.log = (...args: any[]) => {
  if (args[0]?.includes("injecting env")) return;
  originalConsoleLog(...args);
};

dotenv.config();

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
당신은 CSV 분석 챗봇입니다. 아래 도구를 상황에 맞게 사용해 한국어로 간결히 답하세요.
- BasicAnalysisTool: 컬럼 요약/결측치/기초통계
- SelectorTool: 컬럼 추천/페어 추천/전처리 권고
- CorrelationTool: 상관계수/다중공선성/히트맵
- VisualizationTool: 단/이변량 시각화
- PreprocessingTool: 결측/스케일링/인코딩 수행
- MachineLearningTool: 추천 모델 학습/평가

지침:
1) 툴이 필요한 질문이면 해당 툴을 호출해 결과를 바탕으로 답하세요.
2) 원시 JSON은 덤프하지 말고 요약하세요.
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
  const sessionId = rest[2];     // FastAPI에서 전달된 sessionId
  console.log(sessionId)
  const sessionKey = argSession || (csvFilePath ? `local:${csvFilePath}` : "local:default");
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
      // CorrelationTool 사용 시 controllers에 추가
    ],
    histories,
  });

  // ── REPL 보조
  if (process.argv.includes("--interactive")) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const ask = () => rl.question("> ", async (line) => {
      const prompt = `### SYSTEM\n${CHAT_SYSTEM}\n\n### USER\n${line}`;
      const answers = await agent.conversate(prompt);
      saveHistories(sessionKey, answers);
      for (const ans of answers) if ("text" in ans && ans.text) console.log(ans.text);
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
    const result = await workflow.run({ filePath: csvFilePath , sessionId});

    // FastAPI가 파싱할 유일한 stdout
    console.log("<<<WORKFLOW_JSON_START>>>");
    console.log(JSON.stringify({ workflow: result }));
    console.log("<<<WORKFLOW_JSON_END>>>");
    return;
  }

  // 기본: chat 모드
  {
    let prompt = `### SYSTEM\n${CHAT_SYSTEM}\n\n### USER\n${userMessage}`;
    if (csvFilePath) prompt += `\n\n### CONTEXT\nCSV_FILE_PATH=${csvFilePath}`;

    const answers = await agent.conversate(prompt);
    saveHistories(sessionKey, answers);

    // 채팅 답변만 출력 (콘솔 텍스트)
    for (const ans of answers) if ("text" in ans && ans.text) console.log(ans.text);
  }
}

main().catch(console.error);
