import { Agentica } from "@agentica/core";
import { OpenAI } from "openai";
import { BasicAnalysisTool } from "./tools/BasicAnalysisTool";
import { SelectorTool } from "./tools/SelectorTool";
import { WorkflowTool } from "./tools/WorkflowTool";


import typia from "typia";
import readline from "readline";
import dotenv from "dotenv";
import { PreprocessingRequest, PreprocessingTool } from "./tools/PreprocessingTool";
import fs from "fs";
import { VisualizationTool } from "./tools/VisualizationTool";

const originalConsoleLog = console.log;
console.log = (...args: any[]) => {
  if (args[0]?.includes('injecting env')) return; // dotenv 관련 메시지만 무시
  originalConsoleLog(...args);
};

// .env 파일을 불러온다.
dotenv.config();

/* ──────────────────────────────────────────────────────────────────────────────
   [NEW] In-Memory Session Histories (DB 없이 유지)
   - sessions: sessionKey → AgenticaHistoryJson[]
   - loadHistories / saveHistories: text/describe만 저장(문서 권장)
────────────────────────────────────────────────────────────────────────────── */
type HistoryJson = any; // IAgenticaHistoryJson (타입 단순화)
const SESSIONS = new Map<string, HistoryJson[]>();

function loadHistories(sessionKey: string): HistoryJson[] {
  return SESSIONS.get(sessionKey) ?? [];
}
function saveHistories(sessionKey: string, prompts: any[]) {
  const prev = SESSIONS.get(sessionKey) ?? [];
  const delta = prompts
    .map((p) => (typeof p?.toJSON === "function" ? p.toJSON() : p))
    .filter((h: any) => h?.type === "text" || h?.type === "describe");
  SESSIONS.set(sessionKey, [...prev, ...delta]);
}
/* ────────────────────────────────────────────────────────────────────────────── */


// main 함수에서 실행 모드를 결정
async function main() {
  const isInteractive = process.argv.includes("--interactive");

  // OpenAI API 설정
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  // 기본 모드: 명령줄 인자 실행
  const args = process.argv.slice(2);
  const userMessage = args[0] || "";
  const csvFilePath = args[1];
  const argSession = args[2];

  // 세션키 규칙: 사용자/파일 단위로 분리 (없으면 기본값)
  const sessionKey =
    argSession ||
    (csvFilePath ? `local:${csvFilePath}` : "local:default");

  // 이전 히스토리 복원
  const histories = loadHistories(sessionKey);

  // Agentica 에이전트 정의
  const agent = new Agentica({
    model: "chatgpt",
    vendor: {
      model: "gpt-4.1-mini",
      api: openai,
    },
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
      // {
      //   name: "파이프라인 도구",
      //   protocol: "class",
      //   application: typia.llm.application<WorkflowTool, "chatgpt">(),
      //   execute: new WorkflowTool(),
      // }
    ],
    histories, //이전 턴의 대화/요약(Describe)을 복원
  });

  // 인터랙티브 모드(REPL)
  if (isInteractive) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const ask = () => rl.question("> ", async (line) => {
      const answers = await agent.conversate(line);
      saveHistories(sessionKey, answers); // [NEW] 새 히스토리 누적

      // 콘솔 출력(원하면 UI에 맞춰 바꿔도 됨)
      for (const ans of answers) {
        if ("text" in ans && ans.text) console.log(ans.text);
      }
      ask();
    });
    console.log(`🗂 sessionKey=${sessionKey} (메모리 세션 사용)`);
    return ask();
  }


  if (csvFilePath) {
    try {
      const csvContent = fs.readFileSync(csvFilePath, "utf-8");
      //console.log(`📁 CSV 파일 읽음: ${csvFilePath}`);

      // agent에 파일경로와 사용자 메시지 같이 전달해서
      // LLM이 상황에 맞게 도구를 선택하게 한다.
      let prompt = userMessage;
      if (csvFilePath) {
        prompt += `\n\n[CSV 파일 경로]: ${csvFilePath}`;
      }

      const answers = await agent.conversate(prompt);
      saveHistories(sessionKey, answers);

      // console.log("\n✅ Agentica 응답 전체(JSON):");
      // console.log(JSON.stringify(answers, null, 2));

      // for (const answer of answers) {
      //   if ("text" in answer) {
      //     console.log("\n🧠 Agent 응답 메시지:");
      //     console.log(answer.text);
      //   }
      // }

      const workflow = new WorkflowTool();
      const result = await workflow.run({ filePath: csvFilePath });
      console.log(result)

    } catch (e) {
      console.error(`❌ CSV 파일 읽기 실패: ${e}`);
      return;
    }
  } else {
    // CSV 파일 경로가 없으면 그냥 사용자 메시지만 agent에게 넘긴다.
    const answers = await agent.conversate(userMessage);
    saveHistories(sessionKey, answers);

    // console.log("\n✅ Agentica 응답 전체(JSON):");
    // console.log(JSON.stringify(answers, null, 2));

    for (const answer of answers) {
      if ("text" in answer) {
        console.log("\n🧠 Agent 응답 메시지:");
        console.log(answer.text);
      }
    }
  }

}

main().catch(console.error);