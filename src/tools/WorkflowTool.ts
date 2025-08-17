
import { BasicAnalysisTool } from "./BasicAnalysisTool";
import { SelectorTool } from "./SelectorTool";
import { VisualizationTool } from "./VisualizationTool";
import { PreprocessingTool } from "./PreprocessingTool";
import { MachineLearningTool } from "./MachineLearningTool";

export class WorkflowTool {
  static readonly description = "CSV 파일 경로를 받아 통계 분석 및 컬럼 추천, 모델 추천을 자동 수행합니다.";

  public async run({ filePath }: { filePath: string }): Promise<{
    filePath: string;
    columnStats: {
      column: string;
      dtype: string;
      missing: number;
      unique: number;
      mean?: number;
      std?: number;
    }[];
    selectedColumns: string[];
    recommendedPairs: { column1: string; column2: string }[];
    preprocessingRecommendations: {
      column: string;
      fillna?: "drop" | "mean" | "mode";
      normalize?: "minmax" | "zscore";
      encoding?: "label" | "onehot";
    }[];
        targetColumn: string;
    problemType: "regression" | "classification";
    mlModelRecommendation: {
      model: string;
      score: number;
      reason: string;
      params: Record<string, any>;
      alternatives: {
        model: string;
        score: number;
        reason: string;
        params: Record<string, any>;
      }[];
    };
    chartPaths: string[];
    preprocessedFilePath?: string;
    mlResultPath?: { reportPath: string };
  }> {
    if (!filePath) {
      throw new Error("파일 경로(filePath)는 필수입니다.");
    }
    console.log(`\n [WorkflowTool] 시작 - filePath: ${filePath}`);

    //  1. 통계 분석 도구 실행
    const analyzer = new BasicAnalysisTool();
    const { columnStats } = await analyzer.run({ filePath });


    //  2. 컬럼 추천 도구 실행
    const selector = new SelectorTool();
    const {
      selectedColumns,
      recommendedPairs,
      preprocessingRecommendations,
      targetColumn,
      problemType,
      mlModelRecommendation,
    } = await selector.run({ columnStats });

    // 3. 시각화 도구 실행
    const visualizer = new VisualizationTool();
    const chartPaths = await visualizer.run({
      filePath,
      selectorResult: {
        selectedColumns,
        recommendedPairs,
      },
    });

    // 4. 전처리 실행
    const preprocessor = new PreprocessingTool();
    const { messages, preprocessedFilePath } = await preprocessor.runPreprocessing({
      filePath,
      recommendations: preprocessingRecommendations
    });

    // 5. 머신러닝 실행
    const mlTool = new MachineLearningTool();
    const mlResultPath = await mlTool.run({
      filePath : preprocessedFilePath,
      selectorResult: {
        targetColumn,
        problemType,
        mlModelRecommendation,
      },
    });


    //  6. 결과 반환
    console.log(`\n [WorkflowTool 완료]`);
    return {
      filePath,
      columnStats,
      selectedColumns,
      recommendedPairs,
      preprocessingRecommendations,
      targetColumn,
      problemType,
      mlModelRecommendation,
      chartPaths,
      preprocessedFilePath,
      mlResultPath,
    };
  }
}
