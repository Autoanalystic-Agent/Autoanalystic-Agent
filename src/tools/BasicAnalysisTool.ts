import * as fs from "fs/promises";
import * as path from "path";
import * as csv from "csv-parse/sync";
import { BasicAnalysisInput, BasicAnalysisOutput } from "./types";



export class BasicAnalysisTool {
  name = "기초 구조/결측치/통계 분석 도구";

  /**
   * LLM이 이 Tool을 선택할 때 참조할 프롬프트(설명/가이드).
   * ※ 현재 코드는 dtype 매핑 로직을 변경하지 않았습니다(요청 사항).
   */
  readonly prompt = `
[SYSTEM]
너는 CSV의 컬럼 통계 요약을 생성하는 데이터 분석기다.
출력은 반드시 JSON(UTF-8, 1줄)로 내고, 지정 스키마를 벗어나면 안 된다.

[DEVELOPER]
목표:
- 파일 {{filePath}} 를 읽어 컬럼별 통계를 계산하라.
- dtype은 DType 집합(numeric|categorical|datetime|text)로 매핑.
- 숫자형만 mean/std, min/max를 채운다. 결측/고유값은 전 타입 공통.

출력 스키마(BasicAnalysisOutput):
{
  "columnStats": [
    { "column": string, "dtype": string, "missing": number, "unique": number, "mean"?: number, "std"?: number }
  ]
}

제약:
- 컬럼 순서는 원본 순서 유지.
- 계산 실패 시 해당 필드만 생략하고 로그는 출력하지 말 것.
- dtype 라벨 통일: "number"는 사용하지 말고 "numeric"으로.

[USER]
파일 경로: {{filePath}}
표본 미리보기 필요 여부: {{needPreview|true/false}}
  `.trim();

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

      //console.log(" BasicAnalysisTool 결과:", columnStats);
      return { columnStats };
    } catch (err) {
      throw new Error(`파일 분석 중 오류 발생: ${(err as Error).message}`);
    }
  }
}
