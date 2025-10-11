
import { BasicAnalysisTool } from "./BasicAnalysisTool";
import { SelectorTool } from "./SelectorTool";
import { VisualizationTool } from "./VisualizationTool";
import { PreprocessingTool } from "./PreprocessingTool";
import { MachineLearningTool } from "./MachineLearningTool";
import { CorrelationTool } from "./CorrelationTool";
import { ColumnStat, MachineLearningOutput, WorkflowResult, ProblemType, SelectorOutput } from "./types";

import fs from "fs";
import { parse } from "csv-parse/sync";

export class WorkflowTool {
  static readonly description = "CSV 파일 경로를 받아 통계 분석 및 컬럼 추천, 모델 추천을 자동 수행합니다.";

  public async run({ filePath }: { filePath: string }): Promise<WorkflowResult> {
    if (!filePath) {
      throw new Error("파일 경로(filePath)는 필수입니다.");
    }
    console.log(`\n [WorkflowTool] 시작 - filePath: ${filePath}`);

    //  1. 통계 분석 도구 실행
    const analyzer = new BasicAnalysisTool();
    const basic = await analyzer.run({ filePath });
    const columnStats = (basic?.columnStats ?? []) as ColumnStat[];

    // 2. CSV 데이터 읽어서 숫자형 컬럼만 추출
    const csvContent = fs.readFileSync(filePath, "utf-8");
    const records = parse(csvContent, { columns: true, skip_empty_lines: true });

    const numericColumns = columnStats.filter((c) => c.dtype === "number").map((c) => c.column);
    const numericData: Record<string, number[]> = {};
      numericColumns.forEach((col) => {
        numericData[col] = records
          .map((r) => {
            const val = Number((r as Record<string, any>)[col]);
            return Number.isNaN(val) ? null : val;
          })
          .filter((v): v is number => v !== null); // 타입 가드로 number[] 보장
      });


    // 3. CorrelationTool 실행
    const correlationTool = new CorrelationTool();
    const correlationResults = await correlationTool.run({
      data: numericData,
      method: "pearson",
      threshold: 0.8,
      dropna: true,
    });
    console.log("[WorkflowTool] CorrelationTool 완료");


    //  4. 컬럼 추천 도구 실행
    const selector = new SelectorTool();
    const sel = await selector.run({ columnStats, correlationResults });

    const {
      selectedColumns,
      recommendedPairs,
      preprocessingRecommendations,
      targetColumn,
      problemType,
      mlModelRecommendation,
    } = sel;

    // 5. 시각화 도구 실행
    const visualizer = new VisualizationTool();
    const chartPaths = await visualizer.run({
      filePath,
      selectorResult: { selectedColumns, recommendedPairs },
    });

    // 6. 전처리 실행
    //    ⬇️ PreprocessingTool은 fillna: "drop" | "mean" | "mode" 만 지원.
    //       만약 권고안에 "median"이 있다면 안전하게 "mean"으로 매핑.
    const preprocessor = new PreprocessingTool();
    const pre = await preprocessor.runPreprocessing({
      filePath,
      recommendations: preprocessingRecommendations,
    });
    const effectiveFilePath = pre?.preprocessedFilePath || filePath;


    // 7. 머신러닝 실행
    // 🔧 문자열/객체 모두 { reportPath: string }으로 정규화 (map_artifacts와 호환)
    const mlTool = new MachineLearningTool();
    const mlRes = await mlTool.run({
      filePath: effectiveFilePath,
      selectorResult: {
        targetColumn: sel.targetColumn ?? undefined,
        problemType: sel.problemType as Exclude<ProblemType, null> | undefined,
        mlModelRecommendation: sel.mlModelRecommendation ?? undefined,
      },
    });
    
    const mlResultPath =
      typeof mlRes === "string"
        ? { reportPath: mlRes }
        : { reportPath: (mlRes as MachineLearningOutput).reportPath };


    //  6. 결과 반환
    console.log(`\n [WorkflowTool 완료]`);
    return {
      filePath,
      columnStats,
      selectedColumns,
      recommendedPairs,
      preprocessingRecommendations, // 원본도 그대로 표시에 사용
      targetColumn: targetColumn ?? null,
      problemType: (problemType as any) ?? null,
      mlModelRecommendation: mlModelRecommendation ?? null,
      chartPaths,
      preprocessedFilePath: pre?.preprocessedFilePath,
      mlResultPath,
    };
  }
}
