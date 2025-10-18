import { BasicAnalysisTool } from "./BasicAnalysisTool";
import { SelectorTool } from "./SelectorTool";
import { VisualizationTool } from "./VisualizationTool";
import { PreprocessingTool } from "./PreprocessingTool";
import { MachineLearningTool } from "./MachineLearningTool";
import { CorrelationTool } from "./CorrelationTool";
import {
  ColumnStat,
  BasicAnalysisInput, BasicAnalysisOutput,
  CorrelationInput, CorrelationOutput,
  SelectorInput, SelectorOutput,
  VisualizationInput, VisualizationOutput,
  PreprocessingInput, PreprocessingOutput,
  MachineLearningInput, MachineLearningOutput,
  WorkflowResult, ProblemType
} from "./types";
import fs from "fs";
import path from "path";      


export class WorkflowTool {
  static readonly description = "CSV 파일 경로를 받아 통계 분석 및 컬럼 추천, 모델 추천을 자동 수행합니다.";
  
  /**
   * (프롬프트 추가) — 로직/타입/메서드는 변경하지 않음
   * LLM/에이전트가 이 도구의 목적과 입출력, 제약을 이해하도록 돕는 설명 문자열입니다.
   */
  readonly prompt = `
[SYSTEM]
너는 위 툴들을 순차 실행하고, 결과를 단일 표면(WorkflowResult)으로 통합하는 오케스트레이터다.
출력은 반드시 JSON 한 줄.

[DEVELOPER]
수행 순서:
1) BasicAnalysis → columnStats
2) Correlation → correlationResults + artifacts(corr_matrix.csv, high_corr_pairs.json)
3) Selector(columnStats, correlationResults)
4) Visualization(filePath, selectorResult, correlation.matrixPath?)
5) Preprocessing(filePath, recommendations)
6) MachineLearning(effectiveFilePath, selectorResult)

반환(WorkflowResult):
{
  "filePath": string,
  "columnStats": ColumnStat[],
  "correlationResults"?: CorrelationOutput,
  "selectedColumns": string[],
  "recommendedPairs": { column1: string; column2: string }[],
  "preprocessingRecommendations": PreprocessStep[],
  "targetColumn": string|null,
  "problemType": "regression"|"classification"|null,
  "mlModelRecommendation": ...,
  "chartPaths": string[],
  "preprocessedFilePath"?: string,
  "mlResultPath"?: { reportPath: string }
}

제약:
- 각 서브툴 실패 시 해당 단계는 스킵하되 워크플로는 계속 진행.
- 텍스트 로그 출력 금지. JSON만.
- dtype 라벨은 통일(numeric 등).

[USER]
파일: {{filePath}}, 실행옵션: {{optionsJson}}
  `.trim();  

  
  private log(step: string, msg: string) {
    console.log(`[Workflow:${step}] ${msg}`);
  }

  // [NEW] CSV를 가볍게 파싱해 숫자형 컬럼만 data: Record<string, number[]> 로 구성
  //       (의존성 없이, 쉼표 기반 단순 파싱: 큰따옴표 포함 복잡한 CSV는 별도 파서 권장)
  private buildCorrelationData(filePath: string, columnStats: ColumnStat[]): Record<string, number[]> {
    const isNumericDtype = (dt: string) =>
      ["numeric", "number", "int", "integer", "float", "double"].includes(
        (dt || "").toLowerCase()
      );

    const numericCols = columnStats
    .filter(c => isNumericDtype(String(c.dtype)))
    .map(c => c.column);
    
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
      const cells = lines[i].split(",");
      for (const col of numericCols) {
        const idx = colIndex[col];
        if (idx == null) continue;
        const v = cells[idx]?.trim();
        const num = Number(v);
        data[col].push(v === "" || v == null || !Number.isFinite(num) ? NaN : num);
      }
    }
    return data;
  }


  // [NEW] 상관행렬/페어 파일 아티팩트 생성(표 렌더용)
  private saveCorrelationArtifacts(filePath: string, corr: CorrelationOutput) {
    const outDir = path.join(path.dirname(filePath), "artifacts");
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    const base = path.basename(filePath).replace(/\.[^.]+$/, "");
    const matrixCsv = path.join(outDir, `${base}.corr_matrix.csv`);
    const pairsJson = path.join(outDir, `${base}.high_corr_pairs.json`);

    // CSV: 첫 행에 헤더(컬럼명들), 이후 각 행: rowKey, 값들…
    const cols = Object.keys(corr.correlationMatrix);
    const header = ["", ...cols].join(",");
    const rows = cols.map(r => {
      const rvals = cols.map(c => {
        const v = corr.correlationMatrix[r]?.[c];
        return (typeof v === "number" && Number.isFinite(v)) ? v.toFixed(3) : "";
      });
      return [r, ...rvals].join(",");
    });
    fs.writeFileSync(matrixCsv, [header, ...rows].join("\n"), "utf-8");

    // high pairs JSON
    fs.writeFileSync(pairsJson, JSON.stringify(corr.highCorrPairs, null, 2), "utf-8");

    return { matrixCsv, pairsJson };
  }

  // ✅ 반환 타입을 공통 타입으로 고정
  public async run({ filePath }: { filePath: string }, {sessionId} : {sessionId?:string}): Promise<WorkflowResult & {
    steps: {
      basic: { input: BasicAnalysisInput; output: BasicAnalysisOutput };
      correlation?: { input: CorrelationInput; output: CorrelationOutput; artifacts: { matrixCsv: string; pairsJson: string } };
      selector: { input: SelectorInput; output: SelectorOutput };
      visualization: { input: VisualizationInput; output: VisualizationOutput };
      preprocessing: { input: PreprocessingInput; output: PreprocessingOutput };
      machineLearning: { input: MachineLearningInput; output: { reportPath: string } | MachineLearningOutput | string };
    };
  }> {

    if (!filePath) throw new Error("파일 경로(filePath)는 필수입니다.");
    this.log("START", `filePath=${filePath}, sessionId=${sessionId ?? "none"}`);

    // 1) BasicAnalysis
    const analyzer = new BasicAnalysisTool();
    const basicInput: BasicAnalysisInput = { filePath };                  // [ADD]
    const basicOutput: BasicAnalysisOutput = await analyzer.run(basicInput); // [ADD]
    const columnStats: ColumnStat[] = (basicOutput?.columnStats ?? []) as ColumnStat[];


    // 2) Correlation
    let correlationResults: CorrelationOutput | undefined;
    let corrArtifacts: { matrixCsv: string; pairsJson: string } | undefined;
    let correlationStep: { input: CorrelationInput; output: CorrelationOutput; artifacts: { matrixCsv: string; pairsJson: string } } | undefined; // [ADD]
    try {
      const corrTool = new CorrelationTool();
      const corrData = this.buildCorrelationData(filePath, columnStats);
      if (Object.keys(corrData).length) {
        const corrInput: CorrelationInput = { data: corrData, method: "pearson", dropna: true, threshold: 0.7 }; // [ADD]
        const corrOutput: CorrelationOutput = await corrTool.run(corrInput);                                       // [ADD]
        correlationResults = corrOutput;
        corrArtifacts = this.saveCorrelationArtifacts(filePath, corrOutput); // << UI용 파일 생성

        correlationStep = { input: corrInput, output: corrOutput, artifacts: corrArtifacts }; // [ADD]
        this.log("CORR", `method=${correlationResults.method}, highPairs=${correlationResults.highCorrPairs.length}`);
      } else {
        this.log("CORR", "no numeric columns → skip");
      }
    } catch (e: any) {
      this.log("CORR", `failed: ${e?.message ?? e}`);
    }

    // 3) Selector (Correlation은 이후 단계에서 연결)
    const selector = new SelectorTool();
    const selectorInput: SelectorInput = { columnStats, correlationResults }; // [ADD]
    const selectorOutput: SelectorOutput = await selector.run(selectorInput); // [ADD]

    const {
      selectedColumns,
      recommendedPairs,
      preprocessingRecommendations,
      targetColumn,
      problemType,
      mlModelRecommendation,
    } = selectorOutput;

    // 4) Visualization
    const visualizer = new VisualizationTool();
    const visualizationInput: VisualizationInput = {          // [ADD]
      filePath,
      sessionId,
      selectorResult: { selectedColumns, recommendedPairs },
      correlation: { matrixPath: corrArtifacts?.matrixCsv },
    };
    const vizRaw = await visualizer.run(visualizationInput);
    // vizRaw가 배열이면 그대로, 객체면 .chartPaths 사용
    const chartPaths: string[] = Array.isArray(vizRaw)
      ? vizRaw
      : (vizRaw as VisualizationOutput).chartPaths;

    // (선택) 단계 I/O 로그를 유지하려면 VisualizationOutput 객체 형태로 맞춰 저장
    const visualizationOutput: VisualizationOutput = { chartPaths };

    // 5) Preprocessing
    //    ⬇️ PreprocessingTool은 fillna: "drop" | "mean" | "mode" 만 지원.
    //       만약 권고안에 "median"이 있다면 안전하게 "mean"으로 매핑.
    const preprocessor = new PreprocessingTool();
    const preprocessingInput : PreprocessingInput = {
      filePath,
      recommendations: preprocessingRecommendations,
      sessionId,
    };
    const preprocessingOutput: PreprocessingOutput = await preprocessor.runPreprocessing(preprocessingInput); // [ADD]
    const effectiveFilePath = preprocessingOutput?.preprocessedFilePath || filePath;


    // 6) MachineLearning
    const mlTool = new MachineLearningTool();
    const mlInput: MachineLearningInput = {                   // [ADD]
      filePath: effectiveFilePath,
      sessionId,
      selectorResult: {
        targetColumn: targetColumn ?? undefined,
        problemType: (problemType ?? undefined) as Exclude<ProblemType, null> | undefined, // [FIX] 안전 캐스팅
        mlModelRecommendation: mlModelRecommendation ?? undefined,
      },
    };

    // 🔧 문자열/객체 모두 { reportPath: string }으로 정규화 (map_artifacts와 호환)
    const mlRaw = await mlTool.run(mlInput);
    const mlResultPath =
      typeof mlRaw === "string"
        ? { reportPath: mlRaw }
        : { reportPath: (mlRaw as MachineLearningOutput).reportPath };

    this.log("DONE", "workflow completed.");

    // ✅ WorkflowResult 형태로 반환
    return {
      filePath,
      columnStats,
      correlationResults,
      selectedColumns,
      recommendedPairs,
      preprocessingRecommendations,
      targetColumn: targetColumn ?? null,
      problemType: (problemType ?? null) as Exclude<ProblemType, null> | null, // [FIX]
      mlModelRecommendation: mlModelRecommendation ?? null,
      chartPaths,
      preprocessedFilePath: preprocessingOutput?.preprocessedFilePath,
      mlResultPath,
      // [ADD] 단계별 I/O 기록(디버그/리포트용)
      steps: {
        basic: { input: basicInput, output: basicOutput },
        ...(correlationStep ? { correlation: correlationStep } : {}),
        selector: { input: selectorInput, output: selectorOutput },
        visualization: { input: visualizationInput, output: visualizationOutput },
        preprocessing: { input: preprocessingInput, output: preprocessingOutput },
        machineLearning: { input: mlInput, output: mlRaw },
      },
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
