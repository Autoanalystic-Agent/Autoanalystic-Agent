import { Agentica } from "@agentica/core";
import { OpenAI } from "openai";

import typia from "typia";
import readline from "readline";
import dotenv from "dotenv";
import { BasicStatsTool } from "./tools/basicStatsTool";
import { PreprocessingTool } from "./tools/PreprocessingTool";
import fs from "fs";

// .env 파일을 불러온다.
dotenv.config();

async function main() {
  // OpenAI를 정의
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const args = process.argv.slice(2);
  const userMessage = args[0] || "";
  const csvFilePath = args[1]; // 업로드된 CSV 파일명 (optional)

  // Agentica를 사용하여 agent를 생성한다.
  const agent = new Agentica({
    model: "chatgpt",
    vendor: {
      model: "gpt-4.1-mini",
      api: openai,
    },
    // Controller에 Tool을 입력할 수 있다.
    controllers: [
      {
        name: "Basic Stats Tool",
        protocol: "class",
        application: typia.llm.application<BasicStatsTool, "chatgpt">(),
        execute: new BasicStatsTool(),
      },
      {
        name: "Preprocessing Tool",
        protocol: "class",
        application: typia.llm.application<PreprocessingTool, "chatgpt">(),
        execute: new PreprocessingTool(),
      }
    ],
  });

  // CSV파일명이 있으면 채팅

   // 터미널에서 대화를 주고받기 위한 readline interface 생성
  // const rl = readline.createInterface({
  //   input: process.stdin,
  //   output: process.stdout,
  // });

  // // Agent와 대화하는 함수.
  // const conversation = () => {
  //   rl.question("User Input (exit: q) : ", async (input) => {
  //     // q를 입력하면 대화가 종료.
  //     if (input === "q") {
  //       rl.close();
  //       return;
  //     }
		
  //     const answers = await agent.conversate(input);

  //     // Agent의 답변을 console.log한다.
  //     answers.forEach((answer) => {
  //       console.log(JSON.stringify(answer, null, 2));
  //     });

  //     // 대화를 지속할 수 있도록 재귀호출.
  //     conversation();
  //   });
  // };

  let csvContent: string | undefined = undefined;
  if (csvFilePath) {
    try {
      csvContent = fs.readFileSync(csvFilePath, "utf-8");
      console.log(`CSV 파일 읽음: ${csvFilePath}`);
    } catch (e) {
      console.error(`CSV 파일 읽기 실패: ${e}`);
    }
  }

  // userMessage + csvContent를 agent에 전달 (임의 구조)
  // 필요하면 SummarizeTool에 csvContent 넘기도록 메시지 구성
  let prompt = userMessage;
  if (csvContent) {
    //prompt += `\n\n[CSV 파일 내용]${csvContent}`;
    prompt += `\n\n[CSV 파일경로]${csvFilePath}`;
  }

  // conversate 호출
  const answers = await agent.conversate(prompt);

  // 결과 출력 (JSON 형태)
  console.log(JSON.stringify({ answers }, null, 2));
  // answers.forEach((answer) => {
  // if ("text" in answer) {
  //   console.log(answer.text);
  // }
  // });



}

main().catch(console.error);