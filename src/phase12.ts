// src/phase12.ts
import { BasicAnalysisTool } from "./tools/BasicAnalysisTool";
import { SelectorTool } from "./tools/SelectorTool";

export async function runPhase12(
  filePath: string,
  opts?: { targetStrategy?: "last" | "infer" }
): Promise<string> {
  const basic = await new BasicAnalysisTool().run({ filePath });
  const selector = await new SelectorTool().run({
    columnStats: basic.columnStats,
    targetStrategy: opts?.targetStrategy ?? "last",
  });

  // 텍스트 요약 (FastAPI 템플릿에 바로 표시될 내용)
  const summary = [
    `rows/cols: ${basic.rowCount}/${basic.columnCount}`,
    `target: ${selector.targetColumn} (strategy=${opts?.targetStrategy ?? "last"})`,
    `problem: ${selector.problemType}`,
    `pairs(sample): ${selector.recommendedPairs
      .slice(0, 3)
      .map(p => `${p.column1}-${p.column2}(${p.plot})`)
      .join(", ")}`,
    `prep(sample): ${selector.preprocessingRecommendations
      .slice(0, 3)
      .map(r => `${r.column}:${r.fillna || ""}/${r.normalize || ""}/${r.encoding || ""}`)
      .join(" | ")}`,
    `model: ${selector.mlModelRecommendation.model} (${selector.mlModelRecommendation.reason})`,
  ].join("\n");

  // stdout에는 오직 JSON만! (fastapi_main.py가 이걸 파싱함)
  return JSON.stringify({
    answers: [{ message: { content: summary } }],
    phase12: { basic, selector }, // 필요 시 프런트에서 더 활용 가능
  });
}
