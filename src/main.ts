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
import { VisualizationTool } from "./tools/VisualizationTool";

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
  const args = process.argv.slice(2);
  const userMessage = args[0] || "";
  const csvFilePath = args[1];

  if (!csvFilePath) {
    console.log(
      JSON.stringify({ error: "⚠️ CSV 파일 경로를 지정해주세요." })
    );
    return;
  }

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
      {
        name: "머신러닝 도구",
        protocol: "class",
        application: typia.llm.application<MachineLearningTool, "chatgpt">(),
        execute: new MachineLearningTool(),
      },
    ],
  });

  const replyText = await handleUserMessage(userMessage, csvFilePath, agent);

  const output = {
    replyText, // 사람이 읽는 답변
    answers: [{ message: { content: replyText } }], // FastAPI에서 쓰는 구조
    sessionState: sessionState[csvFilePath], // 상태 저장
  };

  console.log(JSON.stringify(output, null, 2));
}

export async function handleUserMessage(
  userMessage: string,
  filePath: string,
  agent: Agentica<"chatgpt">
) {
  if (!filePath || !fs.existsSync(filePath)) {
    return `⚠️ CSV 파일 경로가 유효하지 않습니다: ${filePath}`;
  }

  if (!sessionState[filePath]) {
    sessionState[filePath] = {
      columnStats: undefined,
      selectedColumns: undefined,
      preprocessingDone: false,
      mlModelSelected: null,
    };
  }

  const prompt = `
CSV 분석 AI입니다.
CSV 파일 경로: ${filePath}
현재 상태: ${JSON.stringify(sessionState[filePath], null, 2)}

사용자 질문: "${userMessage}"

규칙:
- 가장 적합한 도구를 선택해서 결과를 반환
- 필요한 선행 도구가 실행되지 않았다면 "이 도구를 사용하기 전에 [도구명]을 먼저 실행해야 합니다"라고 안내
- 전처리 전에도 시각화 가능
- 실행 가능한 도구 결과는 JSON 형태로 반환
`;

  try {
    const answers = await agent.conversate(prompt);
    let finalReply = "";

    for (const answer of answers) {
      if ("text" in answer) {
        console.log("\n🧠 Agent 응답 메시지:");
        console.log(answer.text);
      }
    }
  }

    for (const answer of answers) {
      const content =
        (answer as any)?.text || (answer as any)?.message?.content;
      if (!content) continue;
      finalReply += content + "\n";

      const jsonMatches = content.matchAll(/{[\s\S]*?}/g);
      for (const match of jsonMatches) {
        try {
          const parsed = JSON.parse(match[0]);

          if (parsed.columnStats)
            sessionState[filePath].columnStats = parsed.columnStats;
          if (parsed.selectedColumns) {
            const validColumns = parsed.selectedColumns.filter((col: string) =>
              sessionState[filePath].columnStats?.some((c) => c.column === col)
            );
            if (validColumns.length > 0)
              sessionState[filePath].selectedColumns = validColumns;
          }
          if (parsed.preprocessingDone) {
            sessionState[filePath].preprocessingDone = parsed.preprocessingDone;
            if (parsed.preprocessedFilePath) {
              sessionState[filePath].preprocessedFilePath =
                parsed.preprocessedFilePath;
            }
          }
          if (parsed.mlModelSelected)
            sessionState[filePath].mlModelSelected = parsed.mlModelSelected;
        } catch {
          // JSON 파싱 실패 무시
        }
      }
    }

    return finalReply.trim();
  } catch (err: any) {
    console.error("Agentica 오류:", err);
    return `❌ Agentica 실행 중 오류 발생: ${err?.message || err}`;
  }
}

main().catch(console.error);
