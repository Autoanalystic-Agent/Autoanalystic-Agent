import * as fs from "fs/promises";
import * as path from "path";
import { parse } from "csv-parse/sync";

type Data = Record<string, string | number>[];

function mean(values: number[]): number {
  if (values.length === 0) return NaN;
  const sum = values.reduce((a, b) => a + b, 0);
  return sum / values.length;
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

export class PreprocessingTool {
  private data: Data = [];

  public async loadData(input: { filePath: string }): Promise<string> {
    const { filePath } = input;
    const defaultDir = path.join(process.cwd(), "uploads");
    const cleanedFilePath = filePath.replace(/^.*uploads[\\/]/, "");
    const resolvedPath = path.join(defaultDir, cleanedFilePath);

    try {
      const file = await fs.readFile(resolvedPath, "utf-8");
      const records = parse(file, {
        columns: true,
        skip_empty_lines: true,
      }) as Data;

      this.data = records;
      return "CSV 파일 로딩 성공";
    } catch (err) {
      return `파일을 읽을 수 없습니다: ${(err as Error).message}`;
    }
  }

  // drop일 때는 행 개수 세고, fill일 때는 비어있는 셀의 개수를 셈
  public handleMissing(params: { strategy: "drop" | "mean" | "mode" }): string {
  const { strategy } = params;
  let missingCount = 0;

  if (strategy === "drop") {
    missingCount = this.data.reduce((count, row) => {
      const hasMissing = Object.values(row).some(v => v === null || v === '');
      return count + (hasMissing ? 1 : 0);
    }, 0);

    this.data = this.data.filter(row =>
      Object.values(row).every(v => v !== null && v !== '')
    );
  } else if (strategy === "mean" || strategy === "mode") {
    // 각 컬럼별로 결측치 개수 파악
    const columns = Object.keys(this.data[0] || {});
    const fillValues: { [key: string]: number | string } = {};

    for (const col of columns) {
      const colValues = this.data
        .map(row => row[col])
        .filter(v => v !== null && v !== '');

      if (colValues.length === 0) continue;

      const parsedValues = colValues
        .map(v => typeof v === 'string' ? parseFloat(v) : v)
        .filter(v => !isNaN(v));

      if (parsedValues.length === 0) continue;

      if (strategy === "mean") {
        fillValues[col] = mean(parsedValues);
      } else if (strategy === "mode") {
        const freq: { [key: string]: number } = {};
        for (const v of colValues) {
          const key = String(v);
          freq[key] = (freq[key] || 0) + 1;
        }
        fillValues[col] = Object.entries(freq).reduce((a, b) => a[1] >= b[1] ? a : b)[0];
      }
    }

    this.data = this.data.map(row => {
      const newRow: { [key: string]: string | number } = {};
      for (const key in row) {
        const val = row[key];
        if (val === null || val === '') {
          missingCount += 1;
          newRow[key] = fillValues[key] ?? 0;
        } else {
          newRow[key] = val;
        }
      }
      return newRow;
    });
  }

  return `결측치 처리 완료: ${strategy}. 처리된 결측치 개수: ${missingCount}개`;
}


  public handleOutliers(input: { columns: string[] }): string {
    const { columns } = input;
    for (const col of columns) {
      const values = this.data
        .map((row) => {
          const raw = row[col];
          const val = typeof raw === "string" ? parseFloat(raw) : raw;
          return isNaN(val) ? NaN : val;
        })
        .filter((v) => !isNaN(v));

      const q1 = quantileSeq(values, 0.25);
      const q3 = quantileSeq(values, 0.75);
      const iqr = q3 - q1;
      const lower = q1 - 1.5 * iqr;
      const upper = q3 + 1.5 * iqr;

      this.data = this.data.filter((row) => {
        const raw = row[col];
        const val = typeof raw === "string" ? parseFloat(raw) : raw;
        return val >= lower && val <= upper;
      });
    }
    return `이상치 제거 완료 (IQR)`;
  }

  public scale(input: { columns: string[]; method: "minmax" | "zscore" }): string {
    const { columns, method } = input;
    for (const col of columns) {
      const values = this.data
        .map((row) => {
          const raw = row[col];
          const val = typeof raw === "string" ? parseFloat(raw) : raw;
          return isNaN(val) ? NaN : val;
        })
        .filter((v) => !isNaN(v));

      const mu = mean(values);
      const sigma = std(values);
      const minVal = Math.min(...values);
      const maxVal = Math.max(...values);

      this.data = this.data.map((row) => {
        const raw = row[col];
        const val = typeof raw === "string" ? parseFloat(raw) : raw;
        if (isNaN(val)) return row;

        let scaledVal: number;
        if (method === "zscore") {
          scaledVal = (val - mu) / sigma;
        } else {
          scaledVal = (val - minVal) / (maxVal - minVal);
        }
        row[col] = scaledVal;
        return row;
      });
    }
    return `스케일링 완료 (${method})`;
  }

  public encode(input: { column: string; method: "label" | "onehot" }): string {
    const { column, method } = input;
    const unique = Array.from(new Set(this.data.map((row) => row[column])));

    if (method === "label") {
      const labelMap = Object.fromEntries(unique.map((v, i) => [v, i]));
      this.data = this.data.map((row) => {
        row[column] = labelMap[row[column]];
        return row;
      });
    } else if (method === "onehot") {
      this.data = this.data.map((row) => {
        const encoded: { [key: string]: string | number } = { ...row };
        for (const val of unique) {
          encoded[`${column}_${val}`] = row[column] === val ? 1 : 0;
        }
        delete encoded[column];
        return encoded;
      });
    }
    return `인코딩 완료 (${method})`;
  }

  //분산 기준 선택
  public selectFeatures(input: { threshold: number }): string[] {
    const { threshold } = input;
    const selected: string[] = [];
    for (const key of Object.keys(this.data[0] || {})) {
      const values = this.data
        .map((row) => {
          const raw = row[key];
          const val = typeof raw === "string" ? parseFloat(raw) : raw;
          return isNaN(val) ? NaN : val;
        })
        .filter((v) => !isNaN(v));

      const variance = std(values) ** 2;
      if (variance >= threshold) selected.push(key);
    }
    return selected;
  }

  public generateFeatures(input: { columns: string[]; method: "sum" | "prod" }): string {
    const { columns, method } = input;
    this.data = this.data.map((row) => {
      const values = columns.map((col) => {
        const raw = row[col];
        const val = typeof raw === "string" ? parseFloat(raw) : raw;
        return isNaN(val) ? 0 : val;
      });
      const newVal =
        method === "sum"
          ? values.reduce((a, b) => a + b, 0)
          : values.reduce((a, b) => a * b, 1);
      row[`${method}_${columns.join("_")}`] = newVal;
      return row;
    });
    return `새로운 특성 생성 완료 (${method})`;
  }

  public getPreview(input: { limit?: number }): { [key: string]: string | number }[] {
    const limit = input.limit ?? 5;
    return this.data.slice(0, limit);
  }

  // 저장 기능은 향후 stringify 설치 후 활성화 가능
  // public async exportCSV(outputPath: string) {
  //   const csv = stringify(this.data, { header: true });
  //   await fs.writeFile(outputPath, csv, 'utf-8');
  // }
}
