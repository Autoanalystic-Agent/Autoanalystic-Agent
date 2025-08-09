import { Agentica } from "@agentica/core";
import { OpenAI } from "openai";
import { BasicAnalysisTool } from "./tools/BasicAnalysisTool";
import { SelectorTool } from "./tools/SelectorTool";
import { WorkflowTool } from "./tools/WorkflowTool";


import typia from "typia";
import readline from "readline";
import dotenv from "dotenv";
import { BasicStatsTool } from "./tools/basicStatsTool";
import { PreprocessingTool } from "./tools/PreprocessingTool";
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
      // {
      //   name: "Basic Stats Tool",
      //   protocol: "class",
      //   application: typia.llm.application<BasicStatsTool, "chatgpt">(),
      //   execute: new BasicStatsTool(),
      // },
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
    ],
  });

  // 대화형 모드
  if (isInteractive) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const conversation = () => {
      rl.question("User Input (exit: q) : ", async (input) => {
        if (input === "q") {
          rl.close();
          return;
        }

        try {
          const answers = await agent.conversate(input);
          console.log("\n✅ Agentica 응답 전체(JSON):");
          console.log(JSON.stringify(answers, null, 2));

          for (const answer of answers) {
            if ("text" in answer) {
              console.log("\n🧠 Agent 응답 메시지:");
              console.log(answer.text);
            }
          }
        } catch (err) {
          console.error("❌ Agent 처리 중 오류:", err);
        }

        conversation(); // 재귀 호출
      });
    };

    conversation();
  } 
  else {
    // 기본 모드: 명령줄 인자 실행
    const args = process.argv.slice(2);
    const userMessage = args[0] || "";
    const csvFilePath = args[1];

    let csvContent: string | undefined = undefined;
    if (csvFilePath) {
      try {
        csvContent = fs.readFileSync(csvFilePath, "utf-8");
        console.log(`📁 CSV 파일 읽음: ${csvFilePath}`);

        // workflow 부분 추가
        const workflow = new WorkflowTool();
        const result = await workflow.run({filePath: csvFilePath});

        
        return;
      } catch (e) {
        console.error(`❌ CSV 파일 읽기 실패: ${e}`);
        return;
      }
    }

    // let prompt = userMessage;
    // if (csvContent) {
    //   prompt += `\n\n[CSV 파일경로]${csvFilePath}`;
    // }

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
