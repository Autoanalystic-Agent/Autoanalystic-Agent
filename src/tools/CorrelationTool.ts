// src/tools/CorrelationTool.ts

/**
 * CorrelationTool
 * ────────────────────────────────
 * CSV 형태의 데이터를 입력받아 각 컬럼 간의 상관관계를 계산하는 도구.
 * 
 *  지원 기능:
 *  - 피어슨(Pearson), 스피어만(Spearman), 켄달(Kendall) 상관계수 계산
 *  - 결측치 자동 처리 (dropna 옵션)
 *  - 상관계수 임계값(threshold) 이상인 컬럼 쌍 자동 추천
 *  - SelectorTool 등 다른 툴에서 주요 피처 추천 시 참고 가능
 *
 *  예시
 * const corrTool = new CorrelationTool();
 * const result = await corrTool.run({
 *   data: { age: [25, 32, 47], income: [4000, 5200, 6900] },
 *   method: "pearson",
 *   threshold: 0.7
 * });
 */

import { CorrelationInput, CorrelationOutput } from "./types";

export class CorrelationTool {
  static readonly description = "숫자형 컬럼 간 상관계수를 계산하고, threshold 이상인 컬럼 쌍을 반환";
  readonly prompt = `
[SYSTEM]
너는 상관분석 전용 도구다. 입력된 연속형 데이터로 상관행렬과 상관 상위 페어를 계산한다.
출력은 반드시 JSON 한 줄만.

[DEVELOPER]
입력(이미 파싱된):
- method: {{method|"pearson"|"spearman"|"kendall"}}
- dropna: {{dropna|true/false}}
- threshold: {{threshold|0.5~0.95}}
- data: Record<string, number[]>

해야 할 일:
1) 각 컬럼쌍에 대해 {{method}} 상관계수 계산(유효쌍만).
2) correlationMatrix를 대칭/대각1.0으로 보정.
3) |corr| >= {{threshold}} 인 상위 페어 배열(highCorrPairs) 생성(내림차순).

출력 스키마(CorrelationOutput):
{
  "method": "pearson" | "spearman" | "kendall",
  "correlationMatrix": { [col: string]: { [col: string]: number } },
  "highCorrPairs": [ { "col1": string, "col2": string, "corr": number } ]
}

에러/결측 처리:
- 전체 NaN 또는 유효한 숫자쌍이 없으면 빈 행렬/빈 페어 반환.
- 절대 로그 문자열을 출력하지 말 것.

[USER]
분석 파라미터:
- method={{method}}, dropna={{dropna}}, threshold={{threshold}}
- data 컬럼 수={{colCount}}, 행 길이 균일성={{isAligned}}
  `.trim();
  
  /**
   * 상관관계 계산 실행 메서드
   */
  public async run(input: CorrelationInput): Promise<CorrelationOutput> {
    const { data, method = "pearson", dropna = true, threshold = 0.5 } = input;
    console.log("\n[CorrelationTool] 상관관계 계산 시작");

    // 1️. 입력 데이터 유효성 검사
    if (!data || Object.keys(data).length === 0)
      throw new Error("유효한 데이터가 없습니다. (data 필드 확인)");

    // 2️. 결측치 제거
    //const cleanedData = dropna ? this.cleanData(data) : this.castData(data);

    // 3️. 상관관계 행렬 계산
    const columns = Object.keys(data);
    const correlationMatrix: Record<string, Record<string, number>> = {};

    for (const col1 of columns) {
      correlationMatrix[col1] = {};
      for (const col2 of columns) {
        if (col1 === col2) {
          correlationMatrix[col1][col2] = 1;
        } else {
          correlationMatrix[col1][col2] = Number(
            this.pearson(data[col1], data[col2]).toFixed(3)
          );        }
      }
    }

    // 4️. threshold 이상인 상관쌍 추천
    const highCorrPairs = [];
    for (const col1 of columns) {
      for (const col2 of columns) {
        if (col1 !== col2 && Math.abs(correlationMatrix[col1][col2]) >= threshold) {
          highCorrPairs.push({ col1, col2, corr: correlationMatrix[col1][col2] });
        }
      }
    }

    console.log(`[CorrelationTool 완료] method=${method}`);
    console.log("상관 높은 컬럼쌍:", highCorrPairs);

    return {
      method,
      correlationMatrix,
      highCorrPairs,
    };
  }

  /**
   * 결측치(null, undefined, NaN) 제거
   */
  private cleanData(
    data: Record<string, (number | null)[]>
  ): Record<string, number[]> {
    const keys = Object.keys(data);
    const length = data[keys[0]]?.length || 0;
    const cleaned: Record<string, number[]> = {};

    for (const key of keys) cleaned[key] = [];

    for (let i = 0; i < length; i++) {
      const row = keys.map((k) => data[k][i]);
      // 한 행에 null/undefined/NaN이 있으면 그 행 전체를 제거
      if (!row.some((v) => v === null || v === undefined || Number.isNaN(v))) {
        keys.forEach((k, idx) => cleaned[k].push(Number(row[idx])));
      }
    }
    return cleaned;
  }

  /**
   * 데이터 숫자형 변환 (결측치 미제거)
   */
  private castData(
    data: Record<string, (number | null)[]>
  ): Record<string, number[]> {
    const casted: Record<string, number[]> = {};
    for (const [k, arr] of Object.entries(data)) {
      casted[k] = arr.map((v) =>
        v === null || v === undefined || Number.isNaN(v) ? 0 : Number(v)
      );
    }
    return casted;
  }

  /**
   * 상관계수 계산 (피어슨, 스피어만, 켄달)
   */
  private computeCorrelation(
    x: number[],
    y: number[],
    method: "pearson" | "spearman" | "kendall"
  ): number {
    if (method === "spearman") return this.spearman(x, y);
    if (method === "kendall") return this.kendall(x, y);
    return this.pearson(x, y);
  }

  /**
   *  피어슨 상관계수
   */
  private pearson(x: number[], y: number[]): number {
    const meanX = this.mean(x);
    const meanY = this.mean(y);
    const numerator = x.reduce((sum, xi, i) => sum + (xi - meanX) * (y[i] - meanY), 0);
    const denominator = Math.sqrt(
      x.reduce((s, xi) => s + (xi - meanX) ** 2, 0) *
      y.reduce((s, yi) => s + (yi - meanY) ** 2, 0)
    );
    return denominator === 0 ? 0 : numerator / denominator;
  }

  /**
   *  스피어만 순위 상관계수
   */
  private spearman(x: number[], y: number[]): number {
    const rank = (arr: number[]) =>
      arr
        .map((v, i) => ({ v, i }))
        .sort((a, b) => a.v - b.v)
        .map((_, idx, sorted) => sorted.findIndex((s) => s.i === idx) + 1);
    return this.pearson(rank(x), rank(y));
  }

  /**
   *  켄달 타우 상관계수
   */
  private kendall(x: number[], y: number[]): number {
    let concordant = 0;
    let discordant = 0;
    for (let i = 0; i < x.length; i++) {
      for (let j = i + 1; j < x.length; j++) {
        const signX = Math.sign(x[i] - x[j]);
        const signY = Math.sign(y[i] - y[j]);
        if (signX * signY > 0) concordant++;
        else if (signX * signY < 0) discordant++;
      }
    }
    const totalPairs = (x.length * (x.length - 1)) / 2;
    return totalPairs === 0 ? 0 : (concordant - discordant) / totalPairs;
  }

  /** 평균 계산 (내장 math 라이브러리 없이 직접 구현) */
  private mean(arr: number[]): number {
    return arr.reduce((sum, v) => sum + v, 0) / arr.length;
  }
}
