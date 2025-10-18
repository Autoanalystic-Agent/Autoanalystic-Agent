import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { MachineLearningInput, MachineLearningOutput } from "./types";


export class MachineLearningTool {
  static readonly description =
    "SelectorTool 결과를 기반으로 추천된 ML 모델을 학습하고 평가합니다.";

  /**
   * (프롬프트 추가) — 로직/타입/메서드는 변경하지 않음
   * LLM/에이전트가 이 도구의 목적과 입출력, 제약을 이해하도록 돕는 설명 문자열입니다.
   */
  readonly prompt = `
[SYSTEM]
너는 전처리 산출물(또는 원본)을 학습해 간단한 모델링과 리포트를 생성하는 도구다.
출력은 반드시 JSON 한 줄.

[DEVELOPER]
입력:
- filePath
- selectorResult: { targetColumn?, problemType?, mlModelRecommendation? }

규칙:
1) problemType 판단 → 분류/회귀 파이프라인 선택
2) 추천 모델 우선 시도, 불가 시 합리적 대체 사용
3) 학습/검증 점수, 중요도/계수 요약, 기본 하이퍼파라미터, 간단한 오류 분석 포함
4) 리포트 파일(.txt/.md/.html) 저장 후 경로 반환

출력(MachineLearningOutput):
{ "reportPath": string, ...추가 메트릭 }

제약:
- 과도한 로그/표는 파일에 쓰고 JSON에는 경로와 핵심 숫자만.

[USER]
입력 파일: {{filePath}}, target={{targetColumn}}, type={{problemType}}
  `.trim();

  async run(input: MachineLearningInput): Promise<string | MachineLearningOutput> {
    const { filePath, selectorResult } = input;

    const timestamp = Date.now();
    const outputDir = path.join("src/outputs");
    fs.mkdirSync(outputDir, { recursive: true });

    // 2. Python 실행 커맨드 구성
    const pythonScriptPath = "src/scripts/train_ml_model.py";
    const selectorJsonEscaped = JSON.stringify(selectorResult).replace(/"/g, '\\"');
    const command = `python ${pythonScriptPath} "${filePath}" "${selectorJsonEscaped}" "${outputDir}" ${timestamp}`;

    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error("[MachineLearningTool 에러]", stderr);
          reject(stderr);
        }

        // 모델 결과 파일(.pkl) 탐색 — 타임스탬프를 파일명에 포함하는 기존 규칙 가정
        const modelFile = fs
          .readdirSync(outputDir)
          .filter((f) => f.endsWith(".pkl") && f.includes(String(timestamp)))[0];

        if (!modelFile) {
          reject("ML 결과 파일(.pkl)을 찾을 수 없습니다.");
          return;
        }

        // 보고서 경로(텍스트/HTML 등) — 파이썬 스크립트가 생성한다고 가정
        // 필요 시 train_ml_model.py에서 실제 파일명 규칙만 맞추면 됨
        const reportTxtPath = path.join("src/outputs", `${timestamp}_report.txt`);
        const reportHtmlPath = path.join("src/outputs", `${timestamp}_report.html`);
        const reportPath = fs.existsSync(reportHtmlPath) ? reportHtmlPath : reportTxtPath;

        // ✅ 반환 표면: MachineLearningOutput
        // - FastAPI map_artifacts()는 reportPath를 우선 매핑하여 /outputs 링크를 붙임
        // - modelPath/rawLog는 추가 정보 (UI에서 안 쓰면 무시됨)
        const out: MachineLearningOutput = {
          reportPath,
          modelPath: path.join("src/outputs", modelFile),
          rawLog: (stdout || "").toString().trim(),
        };

        resolve(out);        
      });
    });
  }
}
