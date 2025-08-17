import * as fs from "fs/promises";
import * as path from "path";
import * as csv from "csv-parse/sync";

export class BasicAnalysisTool {
  name = "기초 구조/결측치/통계 분석 도구";

  async run({ filePath }: { filePath: string }): Promise<{
    columnStats: {
      column: string;
      dtype: string;
      missing: number;
      unique: number;
      mean?: number;
      std?: number;
    }[];
  }> {
    if (!filePath?.trim()) {
      throw new Error("CSV 파일 경로가 제공되지 않았습니다.");
    }

    try {
      // uploads 디렉토리 기준으로 경로 정리
      const defaultDir = path.join(process.cwd(), "src/uploads");
      const cleanedFilePath = filePath.replace(/^.*uploads[\\/]/, "");
      const resolvedPath = path.join(defaultDir, cleanedFilePath);

      const stat = await fs.stat(resolvedPath);
      if (stat.isDirectory()) {
        throw new Error("지정한 경로는 디렉터리입니다. CSV 파일을 입력해주세요.");
      }

      const fileContent = await fs.readFile(resolvedPath, "utf-8");

      const records = csv.parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
      }) as Record<string, string>[];

      if (records.length === 0) {
        throw new Error("CSV 파일에 데이터가 없습니다.");
      }

      const columns = Object.keys(records[0]);
      const totalRows = records.length;

      const columnStats: {
        column: string;
        dtype: string;
        missing: number;
        unique: number;
        mean?: number;
        std?: number;
      }[] = [];

      for (const col of columns) {
        const values = records.map(row => row[col]);
        const numericValues = values.map(v => parseFloat(v)).filter(v => !isNaN(v));
        const uniqueValues = new Set(values.filter(v => v !== "" && v != null));

        const stat: any = {
          column: col,
          dtype: numericValues.length > 0 ? "number" : "string",
          missing: values.filter(v => v === "" || v == null).length,
          unique: uniqueValues.size,
        };

        if (numericValues.length > 0) {
          const mean = numericValues.reduce((a, b) => a + b, 0) / numericValues.length;
          const variance = numericValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / numericValues.length;
          const std = Math.sqrt(variance);

          stat.mean = parseFloat(mean.toFixed(2));
          stat.std = parseFloat(std.toFixed(2));
        }

        columnStats.push(stat);
      }

      console.log(" BasicAnalysisTool 결과:", columnStats);
      return { columnStats };
    } catch (err) {
      throw new Error(`파일 분석 중 오류 발생: ${(err as Error).message}`);
    }
  }
}
