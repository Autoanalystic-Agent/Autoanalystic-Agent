
import * as fs from "fs/promises";
import * as path from "path";
import * as csv from "csv-parse/sync";

export class BasicStatsTool {
  public async summarize({ // 통게 요약 : csv파일에서 특정 컬럼을 찾아 mean, max, min 동계를 반환
    filePath,
    column, //= "sepal_length",
  }: {
    filePath: string;
    column?: string;
  }): Promise<string> {
    if (!filePath?.trim()) {
      return `파일 경로가 제공되지 않았습니다.`;
    }
    
    const defaultDir = path.join(process.cwd(), "src", "uploads");
    const cleanedFilePath = filePath.replace(/^.*uploads[\\/]/, "");
    const resolvedPath = path.join(defaultDir, cleanedFilePath);


    console.log(resolvedPath);

    let fileContent: string;
    try {
      const stat = await fs.stat(resolvedPath);
      if (stat.isDirectory()) {
        throw new Error("지정한 경로는 디렉터리입니다. CSV 파일 경로를 입력해주세요.");
      }

      fileContent = await fs.readFile(resolvedPath, "utf-8");
    } catch (err) {
      return `파일을 읽을 수 없습니다: ${(err as Error).message}`;
    }


    const records = csv.parse(fileContent, { // csv 텍스트 -> 자바스크립트 객체로 파싱
        columns: true,
        skip_empty_lines: true,
    }) as Record<string, string>[];

    // 컬럼의 유효성을 검사한다.
    if (records.length === 0) {
      return `데이터가 없습니다.`;
    }

        // 전체 컬럼 목록
    const allColumns = Object.keys(records[0]);

    // 특정 컬럼만 요청된 경우
    if (column) {
      if (!(column in records[0])) {
        return `컬럼 "${column}"이 존재하지 않습니다.`;
      }

      return this.getSummaryForColumn(records, column);
    }

    // 모든 컬럼 요약
    const summaries: string[] = [];

    for (const col of allColumns) {
      const summary = await this.getSummaryForColumn(records, col);
      // 숫자형만 요약에 포함 (에러 메시지 제외)
      if (!summary.includes("숫자 데이터가 없습니다.")) {
        summaries.push(summary);
      }
    }

    return summaries.join("\n\n");
  }

  // 단일 컬럼
  private async getSummaryForColumn(records: Record<string, string>[], column: string): Promise<string> {
    // 숫자 값만 추출한다.
    const values = records.map((row: any) => parseFloat(row[column])).filter((v) => !isNaN(v));

    if (values.length === 0) {
      return `컬럼 "${column}"에 숫자 데이터가 없습니다.`;
    }

    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);

    return `[${column}] 통계 요약\n- 평균: ${mean.toFixed(2)}\n- 최소값: ${min}\n- 최대값: ${max}`;
  }

  public async getColumns({ // CSV 파일에서 컬럼 이름 목록을 추출하여 반환
    filePath,
  }: {
    filePath: string;  // 기본값 제거
  }): Promise<string[]> {
    if (!filePath?.trim()) {
      return [`파일 경로가 제공되지 않았습니다.`];
    }


    const defaultDir = path.join(process.cwd(), "src", "uploads");
    const cleanedFilePath = filePath.replace(/^.*uploads[\\/]/, "");
    const resolvedPath = path.join(defaultDir, cleanedFilePath);

    let fileContent: string;
    try {
      const stat = await fs.stat(resolvedPath);
      if (stat.isDirectory()) {
        throw new Error("지정한 경로는 디렉터리입니다. CSV 파일 경로를 입력해주세요.");
      }

      fileContent = await fs.readFile(resolvedPath, "utf-8");
    } catch (err) {
      return [`파일을 읽을 수 없습니다: ${(err as Error).message}`];
    }


    const records = csv.parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
    }) as Record<string, string>[];

    if (records.length === 0) return [];

    return Object.keys(records[0]); // 첫 번째 행의 키 목록 → 컬럼명
  }
}

