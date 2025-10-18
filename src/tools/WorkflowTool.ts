import { BasicAnalysisTool } from "./BasicAnalysisTool";
import { SelectorTool } from "./SelectorTool";
import { VisualizationTool } from "./VisualizationTool";
import { PreprocessingTool } from "./PreprocessingTool";
import { MachineLearningTool } from "./MachineLearningTool";
import { CorrelationTool } from "./CorrelationTool";
import { ColumnStat, MachineLearningOutput, WorkflowResult, CorrelationInput, CorrelationOutput } from "./types";
import fs from "fs";

export class WorkflowTool {
  static readonly description = "CSV 파일 경로를 받아 통계 분석 및 컬럼 추천, 모델 추천을 자동 수행합니다.";
  
  private log(step: string, msg: string) {
    console.log(`[Workflow:${step}] ${msg}`);
  }

  // [NEW] CSV를 가볍게 파싱해 숫자형 컬럼만 data: Record<string, number[]> 로 구성
  //       (의존성 없이, 쉼표 기반 단순 파싱: 큰따옴표 포함 복잡한 CSV는 별도 파서 권장)
  private buildCorrelationData(filePath: string, columnStats: ColumnStat[]): Record<string, number[]> {
    const numericCols = columnStats.filter(c => c.dtype === "numeric").map(c => c.column);
    if (numericCols.length === 0) return {};

    const text = fs.readFileSync(filePath, "utf-8");
    const lines = text.split(/\r?\n/).filter(Boolean);
    if (lines.length === 0) return {};

    // 헤더
    const header = lines[0].split(",");
    const colIndex: Record<string, number> = {};
    header.forEach((h, idx) => {
      colIndex[h.trim()] = idx;
    });

    // 선택된 숫자형 컬럼만 초기화
    const data: Record<string, number[]> = {};
    for (const col of numericCols) data[col] = [];

    // 데이터 행 파싱
    for (let i = 1; i < lines.length; i++) {
      const raw = lines[i];
      if (!raw.trim()) continue;
      const cells = raw.split(",");

      for (const col of numericCols) {
        const idx = colIndex[col];
        if (idx == null) continue;
        const v = cells[idx]?.trim();
        if (v === undefined || v === "") {
          data[col].push(NaN);
          continue;
        }
        const num = Number(v);
        data[col].push(Number.isFinite(num) ? num : NaN);
      }
    }
    return data;
  }

  // ✅ 반환 타입을 공통 타입으로 고정
  public async run({ filePath, sessionId }: { filePath: string; sessionId?: string }): Promise<WorkflowResult> {
    if (!filePath) throw new Error("파일 경로(filePath)는 필수입니다.");
    this.log("START", `filePath=${filePath}, sessionId=${sessionId ?? "none"}`);

    // 1) BasicAnalysis
    const analyzer = new BasicAnalysisTool();
    const basic = await analyzer.run({ filePath });
    const columnStats = (basic?.columnStats ?? []) as ColumnStat[];

    // 2) Correlation
    let correlationResults: CorrelationOutput | undefined = undefined;
    try {
      const corrTool = new CorrelationTool();
      const corrData = this.buildCorrelationData(filePath, columnStats); // 숫자형만
      if (Object.keys(corrData).length > 0) {
        const corrInput: CorrelationInput = {
          data: corrData,
          method: "pearson",
          dropna: true,
          threshold: 0.7, // 필요 시 조정
        };
        correlationResults = await corrTool.run(corrInput);
        this.log("CORR", `computed with method=${correlationResults.method}, pairs=${correlationResults.highCorrPairs.length}`);
      } else {
        this.log("CORR", "no numeric columns → skip correlation");
      }
    } catch (e: any) {
      this.log("CORR", `failed, skip correlation. reason=${e?.message ?? e}`);
    }

    // 3) Selector (Correlation은 이후 단계에서 연결)
    const selector = new SelectorTool();
    const sel = await selector.run({ columnStats , correlationResults,});

    const {
      selectedColumns,
      recommendedPairs,
      preprocessingRecommendations,
      targetColumn,
      problemType,
      mlModelRecommendation,
    } = sel;

    // 4) Visualization
    const visualizer = new VisualizationTool();
    const chartPaths = await visualizer.run({
      filePath,
      sessionId,
      selectorResult: { selectedColumns, recommendedPairs },
    });

    // 5) Preprocessing
    //    ⬇️ PreprocessingTool은 fillna: "drop" | "mean" | "mode" 만 지원.
    //       만약 권고안에 "median"이 있다면 안전하게 "mean"으로 매핑.
    const preprocessor = new PreprocessingTool();
    const pre = await preprocessor.runPreprocessing({
      filePath,
      recommendations: preprocessingRecommendations,
      sessionId,
    });
    const effectiveFilePath = pre?.preprocessedFilePath || filePath;

    // 6) MachineLearning
    const mlTool = new MachineLearningTool();
    const mlRes = await mlTool.run({
      filePath: effectiveFilePath,
      sessionId,
      selectorResult: {
        targetColumn: targetColumn ?? undefined,
        problemType: (problemType ?? undefined) as any,
        mlModelRecommendation: mlModelRecommendation ?? undefined,
      },
    });

    // 🔧 문자열/객체 모두 { reportPath: string }으로 정규화 (map_artifacts와 호환)
    const mlResultPath =
      typeof mlRes === "string"
        ? { reportPath: mlRes }
        : { reportPath: (mlRes as MachineLearningOutput).reportPath };

    this.log("DONE", "workflow completed.");

    // ✅ WorkflowResult 형태로 반환
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
//     //  1. 통계 분석 도구 실행
//     const analyzer = new BasicAnalysisTool();
//     const { columnStats } = await analyzer.run({ filePath });


//     //  2. 컬럼 추천 도구 실행
//     const selector = new SelectorTool();
//     const {
//       selectedColumns,
//       recommendedPairs,
//       preprocessingRecommendations,
//       targetColumn,
//       problemType,
//       mlModelRecommendation,
//     } = await selector.run({ columnStats });

//     // 3. 시각화 도구 실행
//     const visualizer = new VisualizationTool();
//     const chartPaths = await visualizer.run({
//       filePath,
//       selectorResult: {
//         selectedColumns,
//         recommendedPairs,
//       },
//     });

//     // 4. 전처리 실행
//     const preprocessor = new PreprocessingTool();
//     const { messages, preprocessedFilePath } = await preprocessor.runPreprocessing({
//       filePath,
//       recommendations: preprocessingRecommendations
//     });

//     // 5. 머신러닝 실행
//     const mlTool = new MachineLearningTool();
//     const mlResultPath = await mlTool.run({
//       filePath : preprocessedFilePath,
//       selectorResult: {
//         targetColumn,
//         problemType,
//         mlModelRecommendation,
//       },
//     });


//     //  6. 결과 반환
//     console.log(`\n [WorkflowTool 완료]`);
//     return {
//       filePath,
//       columnStats,
//       selectedColumns,
//       recommendedPairs,
//       preprocessingRecommendations,
//       targetColumn,
//       problemType,
//       mlModelRecommendation,
//       chartPaths,
//       preprocessedFilePath,
//       mlResultPath,
//     };
//   }
// }
