// src/tools/SelectorTool.ts

type DType = "number" | "string";
type Problem = "regression" | "classification";
type Plot = "scatter" | "box" | "heatmap";

export class SelectorTool {
  static readonly description = "CSV 컬럼 요약 데이터를 받아 분석에 적합한 컬럼만 선별";

   /**
   * 옵션:
   * - targetStrategy: "last" | "infer" (기본값 "last" → 기존 동작 유지)
   */
  public async run({
    columnStats,
    targetStrategy = "last",
  }: {
    columnStats: {
      column: string;
      dtype: DType;
      missing: number;
      unique: number;
      mean?: number;
      std?: number;
      min?: number;
      max?: number;
    }[];
    targetStrategy?: "last" | "infer";
  }): Promise<{
    selectedColumns: string[];
    recommendedPairs: { column1: string; column2: string; plot: Plot }[];
    preprocessingRecommendations: {
      column: string;
      fillna?: "drop" | "mean" | "mode";
      normalize?: "minmax" | "zscore";
      encoding?: "label" | "onehot";
    }[];

    // 머신러닝을 위한 필드 추가
    targetColumn: string;
    problemType: Problem;
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
  }> {
    const columnNames = columnStats.map((c) => c.column);
    // 1) 후보 컬럼
    const selectedColumns = columnNames.filter((name) => {
      const lower = name.toLowerCase();
      const isIdLike =
        lower === "id" || lower.endsWith("_id") || lower.endsWith("id") || lower.startsWith("id_");
      const isCodeLike =
        lower === "code" || lower.endsWith("_code") || lower.endsWith("code") || lower.startsWith("code_");
      return !(isIdLike || isCodeLike);
    });

    // dtype 맵
    const dtypeOf: Record<string, DType> = {};
    for (const s of columnStats) dtypeOf[s.column] = s.dtype;

    // 2) recommendedPairs + plot 타입
    const recommendedPairs: { column1: string; column2: string; plot: Plot }[] = [];
    if (selectedColumns.length >= 2) {
      for (let i = 0; i < selectedColumns.length - 1; i++) {
        for (let j = i + 1; j < selectedColumns.length; j++) {
          const a = selectedColumns[i];
          const b = selectedColumns[j];
          const da = dtypeOf[a];
          const db = dtypeOf[b];

          let plot: Plot;
          if (da === "number" && db === "number") plot = "scatter";
          else if (
            (da === "string" && db === "number") ||
            (da === "number" && db === "string")
          )
            plot = "box";
          else plot = "heatmap"; // string-string

          recommendedPairs.push({ column1: a, column2: b, plot });
        }
      }
    }

    // 3) 전처리 권고
    const preprocessingRecommendations = columnStats.map((stat) => {
      const isNumeric = stat.dtype === "number";

      const fillna: "drop" | "mean" | "mode" | undefined =
        stat.missing > 0 ? (isNumeric ? "mean" : "mode") : undefined;

      const normalize: "minmax" | "zscore" | undefined =
        isNumeric ? (stat.std && stat.std > 1 ? "zscore" : "minmax") : undefined;

      const encoding: "label" | "onehot" | undefined =
        !isNumeric ? (stat.unique <= 10 ? "onehot" : "label") : undefined;

      return {
        column: stat.column,
        fillna,
        normalize,
        encoding,
      };
    });

    // 4) 타깃 선택 전략
    let targetColumn = columnStats[columnStats.length - 1].column; // 기본: 마지막
    if (targetStrategy === "infer") {
      // 간단 추론 규칙: (1) 문자열/범주형이면서 적당한 클래스 수(2~30) 우선, 없으면 숫자형 마지막
      const candidates = columnStats.filter(
        (c) => c.dtype !== "number" && c.unique >= 2 && c.unique <= 30
      );
      if (candidates.length > 0) {
        targetColumn = candidates[candidates.length - 1].column; // 뒤쪽 선호
      }
    }

    // 5) 문제 유형 판별
    const targetDtype =
      columnStats.find((c) => c.column === targetColumn)?.dtype || "string";
    const problemType: Problem = targetDtype === "number" ? "regression" : "classification";

    // 6) 모델 추천 (기존 로직 유지)
    const mlModelRecommendation = this.recommendModel(problemType, columnStats);

    // 로그
    console.log(`\n [SelectorTool 결과]:`);
    console.log("- 선택된 컬럼:", selectedColumns);
    console.log("- 추천된 페어(일부):", recommendedPairs.slice(0, 3));
    console.log("- 전처리 추천(일부):", preprocessingRecommendations.slice(0, 3));
    console.log("- 타깃 컬럼:", targetColumn, "(전략:", targetStrategy, ")");
    console.log("- 문제 유형:", problemType);
    console.log("- 모델 추천:", mlModelRecommendation);

    return {
      selectedColumns,
      recommendedPairs,
      preprocessingRecommendations,
      targetColumn,
      problemType,
      mlModelRecommendation,
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
      min?: number;
      max?: number;
    }[]
  ) {
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
      return { ...candidates[0], alternatives: candidates.slice(1) };
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
      return { ...candidates[0], alternatives: candidates.slice(1) };
    }
  }
}
    