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

dotenv.config();

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
