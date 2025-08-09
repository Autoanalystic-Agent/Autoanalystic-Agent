// src/tools/SelectorTool.ts
export class SelectorTool {
  static readonly description = "CSV 컬럼 요약 데이터를 받아 분석에 적합한 컬럼만 선별";

  /**
   * CSV 통계 데이터를 기반으로 분석에 적합한 컬럼들을 추천한다.
   */

  public async run({
    columnStats,
  }: {
    columnStats: {
      column: string;
      dtype: string;
      missing: number;
      unique: number;
      mean?: number;
      std?: number;
    }[];
  }): Promise<{
    selectedColumns: string[];
    recommendedPairs: { column1: string; column2: string }[];
    preprocessingRecommendations: {
      column: string;
      fillna?: "drop" | "mean" | "mode";
      normalize?: "minmax" | "zscore";
      encoding?: "label" | "onehot";
    }[];
    // 머신러닝을 위한 필드 추가
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
  }> {
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

    const targetColumn = columnStats[columnStats.length - 1].column;
    const targetDtype = columnStats[columnStats.length - 1].dtype;
    const problemType = targetDtype === "number" ? "regression" : "classification";
    const mlModelRecommendation = this.recommendModel(problemType, columnStats);


    //  로그 확인
    console.log(`\n [SelectorTool 결과]:`);
    console.log("- 선택된 컬럼:", selectedColumns);
    console.log("- 추천된 페어:", recommendedPairs);
    console.log("- 전처리 추천:", preprocessingRecommendations);
    console.log("- 타겟 컬럼:", targetColumn);
    console.log("- 문제 유형:", problemType);
    console.log("- 모델 추천:", mlModelRecommendation);

    return {
      selectedColumns,
      recommendedPairs,
      preprocessingRecommendations,
      targetColumn,
      problemType,
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
    const numNumeric = columnStats.filter((c) => c.dtype === "number").length;
    const numericRatio = numNumeric / numColumns;

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