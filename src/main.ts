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


// .env 파일을 불러온다.
dotenv.config();
// main 함수에서 실행 모드를 결정
async function main() {
  const isInteractive = process.argv.includes("--interactive");

  // OpenAI API 설정
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

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
    ],
  });



  // 기본 모드: 명령줄 인자 실행
const args = process.argv.slice(2);
const userMessage = args[0] || "";
const csvFilePath = args[1];

if (csvFilePath) {
  try {
    const csvContent = fs.readFileSync(csvFilePath, "utf-8");
    console.log(`📁 CSV 파일 읽음: ${csvFilePath}`);

    // agent에 파일경로와 사용자 메시지 같이 전달해서
    // LLM이 상황에 맞게 도구를 선택하게 한다.
    let prompt = userMessage;
    if (csvFilePath) {
      prompt += `\n\n[CSV 파일 경로]: ${csvFilePath}`;
    }

    const answers = await agent.conversate(prompt);


    console.log("\n✅ Agentica 응답 전체(JSON):");
    console.log(JSON.stringify(answers, null, 2));

    for (const answer of answers) {
      if ("text" in answer) {
        console.log("\n🧠 Agent 응답 메시지:");
        console.log(answer.text);
      }
    }

  } catch (e) {
    console.error(`❌ CSV 파일 읽기 실패: ${e}`);
    return;
  }
} else {
  // CSV 파일 경로가 없으면 그냥 사용자 메시지만 agent에게 넘긴다.
  const answers = await agent.conversate(userMessage);

  console.log("\n✅ Agentica 응답 전체(JSON):");
  console.log(JSON.stringify(answers, null, 2));

  for (const answer of answers) {
    if ("text" in answer) {
      console.log("\n🧠 Agent 응답 메시지:");
      console.log(answer.text);
    }
  }
}

}

main().catch(console.error);
