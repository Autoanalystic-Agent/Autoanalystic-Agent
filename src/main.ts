import { Agentica } from "@agentica/core";
import { OpenAI } from "openai";
import { BasicAnalysisTool } from "./tools/BasicAnalysisTool";
import { SelectorTool } from "./tools/SelectorTool";
import { VisualizationTool } from "./tools/VisualizationTool";
import { PreprocessingTool } from "./tools/PreprocessingTool";
import { MachineLearningTool } from "./tools/MachineLearningTool";

import typia from "typia";
import dotenv from "dotenv";
import fs from "fs";
import readline from "readline";
import Path from "path";

const originalConsoleLog = console.log;
console.log = (...args: any[]) => {
  if (args[0]?.includes('injecting env')) return; // dotenv 관련 메시지만 무시
  originalConsoleLog(...args);
};


dotenv.config();

/* ─────────────────────────────────────────────
   In-Memory Session Histories
───────────────────────────────────────────── */
type HistoryJson = any;
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

/* ─────────────────────────────────────────────
   Session State
───────────────────────────────────────────── */
interface WorkflowContext {
  columnStats?: any[];
  selectedColumns?: string[];
  recommendedPairs?: { column1: string; column2: string }[];
  preprocessingRecommendations?: any[];
  targetColumn?: string;
  problemType?: "regression" | "classification";
  mlModelRecommendation?: any;
  chartPaths?: string[];
  preprocessedFilePath?: string;
  mlResultPath?: any;
}

const sessionState: Record<
  string,
  {
    columnStats?: any[];
    selectedColumns?: string[];
    preprocessingDone: boolean;
    preprocessedFilePath?: string;
    mlModelSelected?: any;
  }
> = {};

/* ─────────────────────────────────────────────
   Main Function
───────────────────────────────────────────── */
async function main() {
  const isInteractive = process.argv.includes("--interactive");

  // OpenAI API
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  // 명령줄 인자
  const args = process.argv.slice(2);
  const userMessage = args[0] || "";
  const csvFilePath = args[1];

  // filename 기준 sessionKey
  const sessionKey = csvFilePath ? Path.basename(csvFilePath) : "default";

  // 이전 히스토리 로드
  const histories = loadHistories(sessionKey);

  if (!csvFilePath && !isInteractive) {
    console.log(JSON.stringify({ error: "⚠️ CSV 파일 경로를 지정해주세요." }));
    return;
  }

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
        name: "시각화 도구",
        protocol: "class",
        application: typia.llm.application<VisualizationTool, "chatgpt">(),
        execute: new VisualizationTool(),
      },
      {
        name: "전처리 도구",
        protocol: "class",
        application: typia.llm.application<PreprocessingTool, "chatgpt">(),
        execute: new PreprocessingTool(),
      },
      {
        name: "머신러닝 도구",
        protocol: "class",
        application: typia.llm.application<MachineLearningTool, "chatgpt">(),
        execute: new MachineLearningTool(),
      },
    ],
    histories,
  });

  /* ─── 인터랙티브 모드 ─── */
  if (isInteractive) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const ask = () =>
      rl.question("> ", async (line) => {
        const answers = await agent.conversate(line);
        saveHistories(sessionKey, answers);
        for (const ans of answers) if ("text" in ans && ans.text) console.log(ans.text);
        ask();
      });
    console.log(`🗂 sessionKey=${sessionKey} (메모리 세션 사용)`);
    return ask();
  }

  /* ─── CSV 처리 모드 ─── */
  if (!fs.existsSync(csvFilePath)) {
    console.log(`⚠️ CSV 파일이 존재하지 않습니다: ${csvFilePath}`);
    return;
  }

  try {
    const replyText = await handleUserMessage(userMessage, csvFilePath, agent, sessionKey);

    const output = {
      replyText,
      sessionState: sessionState[sessionKey],
    };
    console.log(JSON.stringify(output, null, 2));
  } catch (err: any) {
    console.error(`❌ CSV 처리 중 오류 발생: ${err?.message || err}`);
  }
}

/* ─── 사용자 메시지 처리 ─── */
export async function handleUserMessage(
  userMessage: string,
  filePath: string,
  agent: Agentica<"chatgpt">,
  sessionKey: string
) {
  if (!filePath || !fs.existsSync(filePath)) {
    return `⚠️ CSV 파일 경로가 유효하지 않습니다: ${filePath}`;
  }

  if (!sessionState[sessionKey]) {
    sessionState[sessionKey] = {
      columnStats: undefined,
      selectedColumns: undefined,
      preprocessingDone: false,
      mlModelSelected: null,
    };
  }

  const prompt = `
CSV 분석 AI입니다.
CSV 파일 경로: ${filePath}
현재 상태: ${JSON.stringify(sessionState[sessionKey], null, 2)}

사용자 질문: "${userMessage}"

규칙:
- 가장 적합한 도구를 선택해서 결과를 반환
- 필요한 선행 도구가 실행되지 않았다면 안내
- 전처리 전에도 시각화 가능
- 실행 가능한 도구 결과는 JSON 형태로 반환
`;



  try {
    const answers = await agent.conversate(prompt);
    let finalReply = "";

    for (const answer of answers) {
      const content = (answer as any)?.text || (answer as any)?.message?.content;
      if (!content) continue;
      finalReply += content + "\n";

      // JSON 파싱 후 session 업데이트
      const jsonMatches = content.matchAll(/{[\s\S]*?}/g);
      for (const match of jsonMatches) {
        try {
          const parsed = JSON.parse(match[0]);
          const state = sessionState[sessionKey];
          if (parsed.columnStats) state.columnStats = parsed.columnStats;
          if (parsed.selectedColumns) {
            const validColumns = parsed.selectedColumns.filter((col: string) =>
              state.columnStats?.some((c) => c.column === col)
            );
            if (validColumns.length > 0) state.selectedColumns = validColumns;
          }
          if (parsed.preprocessingDone) {
            state.preprocessingDone = parsed.preprocessingDone;
            if (parsed.preprocessedFilePath) state.preprocessedFilePath = parsed.preprocessedFilePath;
          }
          if (parsed.mlModelSelected) state.mlModelSelected = parsed.mlModelSelected;
        } catch {}
      }
    }

    return finalReply.trim();
  } catch (err: any) {
    console.error("Agentica 오류:", err);
    return `❌ Agentica 실행 중 오류 발생: ${err?.message || err}`;
  }
}

main().catch(console.error);
