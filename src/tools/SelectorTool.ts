// src/tools/SelectorTool.ts
import {
  SelectorInput,
  SelectorOutput,
  ColumnStat,
  ProblemType,
} from "./types";


export class SelectorTool {
  static readonly description =     "CSV 컬럼 요약 + (선택) 상관분석 결과를 받아, 분석에 적합한 컬럼/전처리/모델을 추천합니다.";

  /**
   * CSV 통계 데이터를 기반으로 분석에 적합한 컬럼들을 추천한다.
   * (Correlation 결과가 들어오면 추후 이 로직에서 우선순위/다중공선성 제거에 활용 가능)
   */

  public async run(input: SelectorInput): Promise<SelectorOutput> {
    // ⬇️ 기존 `{ columnStats }` 대신 input에서 구조분해만 추가 (correlation/hint는 당장 미사용)
    const { columnStats, correlationResults, hint } = input;

    // [NEW] columnStats가 비어있는 경우의 안전 처리 (반환 타입 준수)
    if (!columnStats || columnStats.length === 0) {
      return {
        selectedColumns: [],
        recommendedPairs: [],
        preprocessingRecommendations: [],
        targetColumn: null,
        problemType: null,
        mlModelRecommendation: null,
      };
    }    
    
    const columnNames = columnStats.map((c) => c.column);
    const selectedColumns = columnNames.filter(
      (name) => !name.toLowerCase().includes("id") && !name.toLowerCase().includes("code")
    );

    const recommendedPairs: { column1: string; column2: string }[] = [];
    if (selectedColumns.length >= 2) {
      for (let i = 0; i < selectedColumns.length - 1; i++) {
        for (let j = i + 1; j < selectedColumns.length; j++) {
          recommendedPairs.push({
            column1: selectedColumns[i],
            column2: selectedColumns[j],
          });
        }
      }
    }
    const preprocessingRecommendations = columnStats.map((stat) => {
      const isNumeric = stat.dtype === "numeric"; // [CHANGED]
      // [KEPT] 결측치 처리 정책 유지
      const fillna: "drop" | "mean" | "mode" | undefined =
        stat.missing > 0 ? (isNumeric ? "mean" : "mode") : undefined;

      // [KEPT] 정규화 정책 유지
      const normalize: "minmax" | "zscore" | undefined =
        isNumeric ? (stat.std && stat.std > 1 ? "zscore" : "minmax") : undefined;

      // [KEPT] 인코딩 정책 유지
      const encoding: "label" | "onehot" | undefined =
        !isNumeric ? (stat.unique <= 10 ? "onehot" : "label") : undefined;

      return {
        column: stat.column,
        fillna,
        normalize,
        encoding,
      };
    });

    // [KEPT] 타깃 컬럼: 기본은 마지막 컬럼을 사용
    // [NEW] hint.targetColumn이 있으면 우선 적용
    const defaultTarget = columnStats[columnStats.length - 1].column;
    const targetColumn = hint?.targetColumn ?? defaultTarget;

    // [CHANGED] 문제 유형 판별에서 dtype === 'numeric' 기준으로 변경
    // [NEW] hint.problemType이 있으면 우선 적용
    const targetDtype =
      columnStats.find((c) => c.column === targetColumn)?.dtype ?? undefined;
    const inferredProblemType: ProblemType =
      hint?.problemType ??
      (targetDtype === "numeric" ? "regression" : "classification");

    // [KEPT] 모델 추천 로직은 기존 함수 재사용 (타입만 보정)
    const mlModelRecommendation = inferredProblemType
      ? this.recommendModel(inferredProblemType as Exclude<ProblemType, null>, columnStats)
      : null;

    //  로그 확인
    console.log(`\n [SelectorTool 결과]:`);
    console.log("- 선택된 컬럼:", selectedColumns);
    console.log("- 추천된 페어:", recommendedPairs);
    console.log("- 전처리 추천:", preprocessingRecommendations);
    console.log("- 타겟 컬럼:", targetColumn);
    console.log("- 문제 유형:", inferredProblemType);
    console.log("- 모델 추천:", mlModelRecommendation);

    return {
      selectedColumns,
      recommendedPairs,
      preprocessingRecommendations,
      targetColumn,
      problemType: inferredProblemType,
      mlModelRecommendation
    };
  }
  private recommendModel(
    problemType: "regression" | "classification",
    columnStats: {
      column: string;
      dtype: string;
      missing: number;
      unique: number;
      mean?: number;
      std?: number;
    }[]
  ) {
    const numColumns = columnStats.length;
    const numNumeric = columnStats.filter((c) => c.dtype === "numeric").length;
    const numericRatio = numNumeric / (numColumns || 1);

    if (problemType === "regression") {
      const candidates = [
        {
          model: "XGBoostRegressor",
          score: 0.9,
          reason: "수치형 중심이며 컬럼 수가 많아 부스팅 계열이 유리",
          params: { max_depth: 6, learning_rate: 0.1 },
        },
        {
          model: "RandomForestRegressor",
          score: 0.85,
          reason: "트리 기반 모델로 범용성이 높음",
          params: { n_estimators: 100, max_depth: 5 },
        },
        {
          model: "LinearRegression",
          score: 0.7,
          reason: "선형 관계가 강할 경우 빠르고 간단하게 적용 가능",
          params: {},
        },
      ];
      return {
        ...candidates[0],
        alternatives: candidates.slice(1),
      };
    } else {
      const candidates = [
        {
          model: "XGBoostClassifier",
          score: 0.91,
          reason: "수치형 중심 + 컬럼 수 많음",
          params: { max_depth: 6, learning_rate: 0.1 },
        },
        {
          model: "RandomForestClassifier",
          score: 0.88,
          reason: "범용 트리 기반 분류기",
          params: { n_estimators: 100, max_depth: 5 },
        },
        {
          model: "LogisticRegression",
          score: 0.75,
          reason: "단순한 이진 분류 문제에 적합",
          params: {},
        },
      ];
      return {
        ...candidates[0],
        alternatives: candidates.slice(1),
      };
    }
  }
}