import { Agentica } from "@agentica/core";
import { OpenAI } from "openai";
import { DateTool, WeatherTool } from "./tools/tools";
import typia from "typia";
import readline from "readline";
import dotenv from "dotenv";

// .env 파일을 불러온다.
dotenv.config();

async function main() {
  // OpenAI를 정의
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  // Agentica를 사용하여 agent를 생성한다.
  const agent = new Agentica({
    model: "chatgpt",
    vendor: {
      model: "gpt-4o-mini",
      api: openai,
    },
    // Controller에 Tool을 입력할 수 있다.
    controllers: [
      {
        name: "Date Tool", // 컨트롤러 이름 설정
        protocol: "class",  // 형식 설정. http, class가 존재한다.
        application: typia.llm.application<DateTool, "chatgpt">(), // OpenAI Function Schema가 들어간다.
        execute: new DateTool(), // OpenAI Function Schema의 구현체가 들어간다. application에 입력된 OpenAI Function Schema를 토대로, excute의 구현체의 함수를 실행한다.
      },
      {
        name: "Weather Tool",
        protocol: "class",
        application: typia.llm.application<WeatherTool, "chatgpt">(),
        execute: new WeatherTool(),
      },
    ],
  });

  // 터미널에서 대화를 주고받기 위한 readline interface 생성
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  // Agent와 대화하는 함수.
  const conversation = () => {
    rl.question("User Input (exit: q) : ", async (input) => {
      // q를 입력하면 대화가 종료.
      if (input === "q") {
        rl.close();
        return;
      }
		
      const answers = await agent.conversate(input);

      // Agent의 답변을 console.log한다.
      answers.forEach((answer) => {
        console.log(JSON.stringify(answer, null, 2));
      });

      // 대화를 지속할 수 있도록 재귀호출.
      conversation();
    });
  };

  conversation();
}

main().catch(console.error);