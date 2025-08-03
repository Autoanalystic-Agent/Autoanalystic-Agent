
import { BasicAnalysisTool } from "./BasicAnalysisTool";
import { SelectorTool } from "./SelectorTool";

export class WorkflowTool {
  static readonly description = "CSV 파일 경로를 받아 통계 분석 및 컬럼 추천을 자동 수행합니다.";

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
    const { selectedColumns, recommendedPairs } = await selector.run({ columnStats });



    //  3. 결과 반환
    console.log(`\n [WorkflowTool 완료]`);
    return {
      filePath,
      columnStats,
      selectedColumns,
      recommendedPairs,
    };
  }
}
