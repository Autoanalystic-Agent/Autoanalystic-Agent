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
    //  로그 확인
    console.log(`\n [SelectorTool 결과]:`);
    console.log("- 선택된 컬럼:", selectedColumns);
    console.log("- 추천된 페어:", recommendedPairs);

    return {
      selectedColumns,
      recommendedPairs,
    };
  }
}