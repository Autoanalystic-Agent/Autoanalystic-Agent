import { Agentica } from "@agentica/core";
import { OpenAI } from "openai";
import { BasicAnalysisTool } from "./tools/BasicAnalysisTool";
import { SelectorTool } from "./tools/SelectorTool";
import { WorkflowTool } from "./tools/WorkflowTool";
import { runPhase12 } from "./phase12";

import typia from "typia";
import readline from "readline";
import dotenv from "dotenv";
import { BasicStatsTool } from "./tools/basicStatsTool";
import fs from "fs";

// .env 파일을 불러온다.
dotenv.config();
// main 함수에서 실행 모드를 결정
async function main() {
  // 기본 모드: 명령줄 인자 실행
  const args = process.argv.slice(2);
  const userMessage = args[0] || "";
  const csvFilePath = args[1];
  const targetStrategy = (args[2] as "last" | "infer") || "last";



  // ─────────────────────────────────────────────────────────────
  // 1) 결정론적 디버그 경로: phase12 (툴 1→2 직접 호출, stdout=JSON 한 줄)
  // ─────────────────────────────────────────────────────────────
  if (userMessage === "phase12" && csvFilePath) {
    try {
      const out = await runPhase12(csvFilePath, { targetStrategy });
      console.log(out); // ✅ stdout은 JSON만
    } catch (e: any) {
      console.error(e); // 로그는 stderr
      console.log(JSON.stringify({
        answers: [{ message: { content: `❌ 에러: ${e?.message || e}` } }]
      }));
    }
    return;
  }



  // const isInteractive = process.argv.includes("--interactive");

  // ─────────────────────────────────────────────────────────────
  // 2) 에이전트 경로: LLM이 도구를 스스로 골라 쓰고 자유 서술
  //    (stdout=JSON 한 줄, 로그=stderr)
  // ─────────────────────────────────────────────────────────────
  try{
    if (csvFilePath && !fs.existsSync(csvFilePath)) {
      console.error(`⚠️ CSV 파일이 존재하지 않습니다: ${csvFilePath}`);
    }

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
      ],
    });

    // 🔧 프롬프트 프리픽스: LLM이 도구를 우선 호출하고 간결 요약하도록 유도
    const prefix =
      "역할: 당신은 CSV 자동 분석 에이전트입니다.\n" +
      "툴: '기초 분석 도구', '컬럼 선택 도구'를 먼저 호출해 데이터를 파악한 뒤, " +
      "사용자가 이해하기 쉬운 한국어 요약/권고를 제공합니다.\n" +
      "지침:\n" +
      "- CSV 경로가 전달되면 두 툴을 우선 호출하세요.\n" +
      "- 결과를 바탕으로 8줄 이내로 핵심만 요약:\n" +
      "  1) 데이터 개요(행/열, 주요 dtype)\n" +
      "  2) 눈에 띄는 통계/상관(있다면)\n" +
      "  3) 전처리 핵심 2~3개(결측/정규화/인코딩)\n" +
      "  4) 시각화 제안 2~3개\n" +
      "  5) 모델 후보와 이유(간단)\n" +
      "- 타깃이 불명확하면 기본은 마지막 컬럼, 더 나은 후보가 있으면 후보로 함께 제시.\n" +
      "- 장황 금지, 간결한 근거 포함.\n";

    let prompt = `${prefix}\n사용자 요청:\n${userMessage || "(요청 없음)"}`;
    if (csvFilePath) prompt += `\n\n[CSV 파일 경로]: ${csvFilePath}`;

    // let prompt = userMessage;
    // if (csvFilePath) {
    //   // fastapi가 넘겨준 업로드 경로를 프롬프트에만 전달 (도구가 내부에서 읽음)
    //   prompt += `\n\n[CSV 파일 경로]: ${csvFilePath}`;
    // }
    const answers = await agent.conversate(prompt);

      


    // 텍스트만 모아 한 덩어리로
    const text = answers
      .map((a: any) => ("text" in a ? a.text : ""))
      .filter(Boolean)
      .join("\n");

    console.log(JSON.stringify({
      answers: [{ message: { content: text || "(no output)" } }],
    }));
  } catch (e: any) {
    console.error(e);
    console.log(JSON.stringify({
      answers: [{ message: { content: `❌ 에러: ${e?.message || e}` } }],
    }));
  }
}

main().catch((err) => {
  console.error(err);
  console.log(JSON.stringify({
    answers: [{ message: { content: `❌ 에러: ${err?.message || err}` } }],
  }));
});


// if (csvFilePath) {
//   try {
//     const csvContent = fs.readFileSync(csvFilePath, "utf-8");
//     console.log(`📁 CSV 파일 읽음: ${csvFilePath}`);

//     // agent에 파일경로와 사용자 메시지 같이 전달해서
//     // LLM이 상황에 맞게 도구를 선택하게 한다.
//     let prompt = userMessage;
//     if (csvFilePath) {
//       prompt += `\n\n[CSV 파일 경로]: ${csvFilePath}`;
//     }

//     const answers = await agent.conversate(prompt);


//     console.log("\n✅ Agentica 응답 전체(JSON):");
//     console.log(JSON.stringify(answers, null, 2));

//     for (const answer of answers) {
//       if ("text" in answer) {
//         console.log("\n🧠 Agent 응답 메시지:");
//         console.log(answer.text);
//       }
//     }
//   } catch (e) {
//     console.error(`❌ CSV 파일 읽기 실패: ${e}`);
//     return;
//   }
// } else {
//   // CSV 파일 경로가 없으면 그냥 사용자 메시지만 agent에게 넘긴다.
//   const answers = await agent.conversate(userMessage);

//   console.log("\n✅ Agentica 응답 전체(JSON):");
//   console.log(JSON.stringify(answers, null, 2));

//   for (const answer of answers) {
//     if ("text" in answer) {
//       console.log("\n🧠 Agent 응답 메시지:");
//       console.log(answer.text);
//     }
//   }
// }

// }