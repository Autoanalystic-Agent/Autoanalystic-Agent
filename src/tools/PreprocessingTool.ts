import * as fs from "fs/promises";
import * as path from "path";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";

type Data = Record<string, string | number>[];

export interface PreprocessingRequest {
  filePath: string; 
  recommendations: PreprocessingRecommendation[];
}

//export type PreprocessingResponse = string[];

export interface PreprocessingResponse {
  messages: string[];
  preprocessedFilePath: string;
}

function mean(values: number[]): number {
  if (values.length === 0) return NaN;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function std(values: number[]): number {
  if (values.length === 0) return NaN;
  const mu = mean(values);
  const variance = values.reduce((acc, v) => acc + (v - mu) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

function quantileSeq(values: number[], q: number): number {
  if (values.length === 0) return NaN;
  const sorted = [...values].sort((a, b) => a - b);
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  if (base + 1 < sorted.length) {
    return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
  } else {
    return sorted[base];
  }
}

export interface PreprocessingRecommendation {
  column: string;
  fillna?: "drop" | "mean" | "mode";
  normalize?: "minmax" | "zscore";
  encoding?: "label" | "onehot";
}

export class PreprocessingTool {
  private data: Data = [];

  private handleMissingColumn(params: { column: string; strategy: "drop" | "mean" | "mode" }): string {
    const { column, strategy } = params;
    let missingCount = 0;

    if (strategy === "drop") {
      missingCount = this.data.reduce((count, row) => {
        const val = row[column];
        return count + (val === null || val === "" ? 1 : 0);
      }, 0);
      this.data = this.data.filter(row => row[column] !== null && row[column] !== "");
    } 
    else {
      const colValues = this.data
        .map(row => row[column])
        .filter(v => v !== null && v !== "");
      if (colValues.length === 0) return `컬럼 ${column}: 결측치가 없거나 데이터 없음`;

      const parsedValues = colValues
        .map(v => typeof v === "string" ? parseFloat(v) : v)
        .filter(v => !isNaN(v));

      if (parsedValues.length === 0) return `컬럼 ${column}: 숫자형 데이터 없음`;

      let fillValue: number | string;
      if (strategy === "mean") {
        fillValue = mean(parsedValues);
      } else {
        const freq: Record<string, number> = {};
        for (const v of colValues) {
          const key = String(v);
          freq[key] = (freq[key] || 0) + 1;
        }
        fillValue = Object.entries(freq).reduce((a, b) => a[1] >= b[1] ? a : b)[0];
      }

      this.data = this.data.map(row => {
        if (row[column] === null || row[column] === "") {
          missingCount++;
          row[column] = fillValue;
        }
        return row;
      });
    }

    return `컬럼 ${column} 결측치 처리 완료 (${strategy}), 처리 개수: ${missingCount}`;
  }

  private scaleColumn(params: { column: string; method: "minmax" | "zscore" }): string {
    const { column, method } = params;
    const values = this.data
      .map(row => typeof row[column] === "string" ? parseFloat(row[column] as string) : row[column])
      .filter(v => typeof v === "number" && !isNaN(v)) as number[];

    if (values.length === 0) return `컬럼 ${column}: 숫자형 데이터 없음`;

    const mu = mean(values);
    const sigma = std(values);
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);

    this.data = this.data.map(row => {
      let val = typeof row[column] === "string" ? parseFloat(row[column] as string) : row[column];
      if (typeof val !== "number" || isNaN(val)) return row;

      if (method === "zscore") {
        val = (val - mu) / sigma;
      } else {
        val = (val - minVal) / (maxVal - minVal);
      }
      row[column] = val;
      return row;
    });

    return `컬럼 ${column} 스케일링 완료 (${method})`;
  }

  private encodeColumn(params: { column: string; method: "label" | "onehot" }): string {
    const { column, method } = params;
    const unique = Array.from(new Set(this.data.map(row => row[column])));

    if (method === "label") {
      const labelMap = Object.fromEntries(unique.map((v, i) => [v, i]));
      this.data = this.data.map(row => {
        row[column] = labelMap[row[column]];
        return row;
      });
    } 
    else {
      this.data = this.data.map(row => {
        const encoded: Record<string, string | number> = { ...row };
        for (const val of unique) {
          encoded[`${column}_${val}`] = row[column] === val ? 1 : 0;
        }
        delete encoded[column];
        return encoded;
      });
    }

    return `컬럼 ${column} 인코딩 완료 (${method})`;
  }

  public async runPreprocessing(request: PreprocessingRequest): Promise<PreprocessingResponse> {
    // CSV 로딩
    const defaultDir = path.join(process.cwd(), "src/uploads");
    const cleanedFilePath = request.filePath.replace(/^.*uploads[\\/]/, "");
    const resolvedPath = path.join(defaultDir, cleanedFilePath);

    try {
      const file = await fs.readFile(resolvedPath, "utf-8");
      this.data = parse(file, { columns: true, skip_empty_lines: true }) as Data;
    } catch (err) {
      return {
      messages: [`파일을 읽을 수 없습니다: ${(err as Error).message}`],
      preprocessedFilePath: ""
    };
    }

    const results: string[] = [];

    for (const rec of request.recommendations) {
      if (rec.fillna) {
        results.push(this.handleMissingColumn({ column: rec.column, strategy: rec.fillna }));
      }
    }
    for (const rec of request.recommendations) {
      if (rec.normalize) {
        results.push(this.scaleColumn({ column: rec.column, method: rec.normalize }));
      }
    }
    for (const rec of request.recommendations) {
      if (rec.encoding) {
        results.push(this.encodeColumn({ column: rec.column, method: rec.encoding }));
      }
    }
    
    const outputFileName = `preprocessed_${cleanedFilePath}`;
    const outputPath = path.join(process.cwd(), "src/outputs", outputFileName);
    const csv = stringify(this.data, { header: true });
    await fs.writeFile(outputPath, csv, "utf-8");

    return { messages: results, preprocessedFilePath: outputPath };
  }

}
