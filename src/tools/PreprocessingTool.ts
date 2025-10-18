import * as fs from "fs/promises";
import * as path from "path";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";
import { PreprocessingInput, PreprocessingOutput, PreprocessStep } from "./types";

type Data = Record<string, string | number>[];

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

// [FIX] 결측치 판정(기존 로직 확장: undefined/공백문자열 포함)
const isMissing = (v: unknown) =>
  v === null || v === undefined || (typeof v === "string" && v.trim() === "");


export interface PreprocessingRecommendation {
  column: string;
  fillna?: "drop" | "mean" | "mode";
  normalize?: "minmax" | "zscore";
  encoding?: "label" | "onehot";
}

export class PreprocessingTool {
  /**
   * (프롬프트 추가) — 로직/타입/메서드는 변경하지 않음
   * LLM/에이전트가 이 도구의 목적과 입출력, 제약을 이해하도록 돕는 설명 문자열입니다.
   */
  readonly prompt = `
[SYSTEM]
너는 CSV를 받아 지정된 전처리를 수행해 새 CSV를 저장하는 도구다.
출력은 반드시 JSON 한 줄.

[DEVELOPER]
입력:
- filePath
- recommendations: PreprocessStep[]

규칙:
- fillna: drop → 행 제거 / mean|mode → 해당 컬럼 대치
- normalize: minmax 또는 zscore
- encoding: onehot 또는 label (문자열만)
- 원본은 보존, 새 CSV를 OUTPUT_DIR에 저장

출력(PreprocessingOutput):
{ "preprocessedFilePath"?: string, "messages"?: string[] }

제약:
- 메시지는 간결한 작업 로그(문장 1줄씩).
- 실패 항목은 메시지에만 남기고 가능한 작업은 계속 진행.

[USER]
입력 파일: {{filePath}}, 단계 수: {{recommendations.length}}
  `.trim();

  // [ADD] 웹 경로로 변환: 절대/상대 경로 -> /outputs/... 형식
  private toWebUrl(absOrRelPath: string) {
    const abs = path.resolve(absOrRelPath).replace(/\\/g, "/");
    const idx = abs.lastIndexOf("/outputs/");
    const relFromOutputs = idx >= 0 ? abs.slice(idx + 1) : `outputs/${path.basename(abs)}`;
    return `/${relFromOutputs}`.replace(/\\/g, "/");
  }

  
  private data: Data = [];

  private handleMissingColumn(params: { column: string; strategy: "drop" | "mean" | "mode" }): string {
    const { column, strategy } = params;
    let missingCount = 0;

    if (strategy === "drop") {
      // [FIX] undefined/공백문자열 포함 처리가능
      missingCount = this.data.reduce((count, row) => count + (isMissing(row[column]) ? 1 : 0), 0); // [FIX]
      this.data = this.data.filter(row => !isMissing(row[column])); // [FIX]
      return `컬럼 ${column} 결측치 처리 완료 (${strategy}), 처리 개수: ${missingCount}`;
    }
    
    const colValues = this.data
      .map(row => row[column])
      .filter(v => !isMissing(v)); // [FIX]
    if (colValues.length === 0) return `컬럼 ${column}: 결측치가 없거나 데이터 없음`;

    const parsedValues = colValues
      .map(v => typeof v === "string" ? parseFloat(v) : v)
      .filter(v => !isNaN(v));

    if (parsedValues.length === 0 && strategy === "mean") return `컬럼 ${column}: 숫자형 데이터 없음`; // [FIX]

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
      if (isMissing(row[column])) { // [FIX]
        missingCount++;
        row[column] = fillValue;
      }
      return row;
    });
    

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
        val = sigma === 0 ? 0 : (val - mu) / sigma; // [FIX] 분산 0 보호
      } else {
        val = maxVal === minVal ? 0 : (val - minVal) / (maxVal - minVal); // [FIX] 범위 0 보호
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
      return `컬럼 ${column} 인코딩 완료 (${method})`; // [FIX] label 수행 시 즉시 종료(원-핫 추가 방지)

    } 

    this.data = this.data.map(row => {
      const encoded: Record<string, string | number> = { ...row };
      for (const val of unique) {
        encoded[`${column}_${val}`] = row[column] === val ? 1 : 0;
      }
      delete encoded[column];
      return encoded;
    });

    return `컬럼 ${column} 인코딩 완료 (${method})`;
  }

  public async runPreprocessing(request: PreprocessingInput): Promise<PreprocessingOutput> { // [CHG]
    // [CHG] 파일 경로 해석: 더 이상 src/uploads 강제 X, 전달받은 경로 그대로 사용
    const resolvedPath = path.resolve(request.filePath); // [CHG]

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

    for (const rec of request.recommendations as PreprocessStep[]) { // [FIX]
      if (rec.fillna) {
        results.push(this.handleMissingColumn({ column: rec.column, strategy: rec.fillna }));
      }
    }
    for (const rec of request.recommendations as PreprocessStep[]) {
      if (rec.normalize) {
        results.push(this.scaleColumn({ column: rec.column, method: rec.normalize }));
      }
    }
    for (const rec of request.recommendations as PreprocessStep[]) {
      if (rec.encoding) {
        results.push(this.encodeColumn({ column: rec.column, method: rec.encoding }));
      }
    }
    
    // [CHG] 세션/런별 산출물 폴더 사용: 전달받은 outputDir 우선, 없으면 /outputs
    const outDir = request.outputDir ?? path.join("outputs");        // [CHG]
    await fs.mkdir(outDir, { recursive: true });                      // [CHG]

    const base = path.basename(resolvedPath);
    const outputFileName = `preprocessed_${base}`;
    const absOutputPath = path.join(outDir, outputFileName);          // [CHG]

    const csv = stringify(this.data, { header: true });
    await fs.writeFile(absOutputPath, csv, "utf-8");

    // [ADD] 프런트에서 바로 쓸 수 있게 /outputs/... URL로 반환
    const webUrl = this.toWebUrl(absOutputPath);                      // [ADD]


    return { messages: results, preprocessedFilePath: webUrl, outputDir: outDir }; // [CHG]
  }
}
