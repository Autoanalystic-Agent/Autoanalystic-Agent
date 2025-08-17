import * as fs from "fs/promises";
import * as path from "path";
import * as csv from "csv-parse/sync";

type DType = "number" | "string";

export class BasicAnalysisTool {
  name = "기초 구조/결측치/통계 분석 도구(보강)";

  async run({ filePath }: { filePath: string }): Promise<{
    rowCount: number;
    columnCount: number;
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
    correlations: { col1: string; col2: string; pearson: number }[]; // 숫자형 쌍만
  }> {
    if (!filePath?.trim()) {
      throw new Error("CSV 파일 경로가 제공되지 않았습니다.");
    }

    try {
      // uploads 디렉토리 기준으로 경로 정리
      const defaultDir = path.join(process.cwd(), "uploads");
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
        dtype: DType;
        missing: number;
        unique: number;
        mean?: number;
        std?: number;
        min?: number;
        max?: number;
      }[] = [];

       // 헬퍼
      const toNumber = (v: string) => {
        const n = parseFloat(v);
        return Number.isFinite(n) ? n : NaN;
      };

      for (const col of columns) {
        const values = records.map((row) => row[col]);
        const nonEmpty = values.filter((v) => v !== "" && v != null);

        // ✅ dtype 강화: nonEmpty 전체가 숫자로 파싱 가능해야 number
        const numericValuesRaw = nonEmpty.map(toNumber);
        const isNumeric =
          nonEmpty.length > 0 &&
          numericValuesRaw.every((n) => Number.isFinite(n));

        const missing = totalRows - nonEmpty.length;
        const unique = new Set(nonEmpty).size;

        const statAny: any = {
          column: col,
          dtype: (isNumeric ? "number" : "string") as DType,
          missing,
          unique,
        };

        if (isNumeric) {
          const numericValues = numericValuesRaw as number[];
          const mean =
            numericValues.reduce((a, b) => a + b, 0) / numericValues.length;
          const variance =
            numericValues.reduce((s, v) => s + Math.pow(v - mean, 2), 0) /
            numericValues.length; // 모집단 표준편차
          const std = Math.sqrt(variance);
          const min = Math.min(...numericValues);
          const max = Math.max(...numericValues);

          statAny.mean = parseFloat(mean.toFixed(4));
          statAny.std = parseFloat(std.toFixed(4));
          statAny.min = min;
          statAny.max = max;
        }

        columnStats.push(statAny);
      }

      // ✅ 피어슨 상관계수 (숫자형 컬럼쌍)
      const numCols = columnStats
        .filter((c) => c.dtype === "number")
        .map((c) => c.column);

      const pearsons: { col1: string; col2: string; pearson: number }[] = [];
      const colToVec: Record<string, number[]> = {};
      for (const c of numCols) {
        const vec = records
          .map((r) => r[c])
          .filter((v) => v !== "" && v != null)
          .map(toNumber)
          .filter((n) => Number.isFinite(n)) as number[];
        colToVec[c] = vec;
      }

      const corr = (x: number[], y: number[]) => {
        const n = Math.min(x.length, y.length);
        if (n < 2) return NaN;
        const _x = x.slice(0, n);
        const _y = y.slice(0, n);
        const mx = _x.reduce((a, b) => a + b, 0) / n;
        const my = _y.reduce((a, b) => a + b, 0) / n;
        let num = 0,
          denx = 0,
          deny = 0;
        for (let i = 0; i < n; i++) {
          const dx = _x[i] - mx;
          const dy = _y[i] - my;
          num += dx * dy;
          denx += dx * dx;
          deny += dy * dy;
        }
        if (denx === 0 || deny === 0) return NaN;
        return num / Math.sqrt(denx * deny);
      };

      for (let i = 0; i < numCols.length - 1; i++) {
        for (let j = i + 1; j < numCols.length; j++) {
          const c1 = numCols[i],
            c2 = numCols[j];
          const r = corr(colToVec[c1], colToVec[c2]);
          if (Number.isFinite(r)) {
            pearsons.push({ col1: c1, col2: c2, pearson: parseFloat(r.toFixed(4)) });
          }
        }
      }

      const result = {
        rowCount: totalRows,
        columnCount: columns.length,
        columnStats,
        correlations: pearsons,
      };

      console.log(" BasicAnalysisTool 결과:", {
        rowCount: result.rowCount,
        columnCount: result.columnCount,
        sample: result.columnStats.slice(0, 2),
        corrTop3: pearsons.slice(0, 3),
      });

      return result;
    } catch (err) {
      throw new Error(`파일 분석 중 오류 발생: ${(err as Error).message}`);
    }
  }
}
