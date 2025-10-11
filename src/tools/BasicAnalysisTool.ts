import * as fs from "fs/promises";
import * as path from "path";
import * as csv from "csv-parse/sync";
import { BasicAnalysisInput, BasicAnalysisOutput } from "./types";


export class BasicAnalysisTool {
  name = "기초 구조/결측치/통계 분석 도구";

  // [CHANGED] 시그니처: (익명 객체) → BasicAnalysisInput / 반환 → BasicAnalysisOutput
  async run(input: BasicAnalysisInput): Promise<BasicAnalysisOutput> {
    // [ADDED] input에서 filePath 추출
    const { filePath } = input;


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

      const columnStats: BasicAnalysisOutput["columnStats"] = [];


      for (const col of columns) {
        const values = records.map(row => row[col]);
        const numericValues = values.map(v => parseFloat(v)).filter(v => !isNaN(v));
        const uniqueValues = new Set(values.filter(v => v !== "" && v != null));
        const dtype =
          numericValues.length > 0
            ? /* 'numeric' */ "number"
            : /* 'categorical' */ "string";

        // [KEPT] 기존 통계 계산 로직 유지
        const item: any = {
          column: col,
          dtype,
          missing: values.filter((v) => v === "" || v == null).length,
          unique: uniqueValues.size,
        };


        if (numericValues.length > 0) {
          const mean = numericValues.reduce((a, b) => a + b, 0) / numericValues.length;
          const variance = numericValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / numericValues.length;
          const std = Math.sqrt(variance);
          const min = Math.min(...numericValues);
          const max = Math.max(...numericValues);

          item.mean = parseFloat(mean.toFixed(2));
          item.std = parseFloat(std.toFixed(2));
          item.min = parseFloat(min.toFixed(2));
          item.max = parseFloat(max.toFixed(2));
        }

        columnStats.push(item);
      }

      console.log(" BasicAnalysisTool 결과:", columnStats);
      return { columnStats };
    } catch (err) {
      throw new Error(`파일 분석 중 오류 발생: ${(err as Error).message}`);
    }
  }
}
