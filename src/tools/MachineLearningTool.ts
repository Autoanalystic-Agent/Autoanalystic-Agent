import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { MachineLearningInput, MachineLearningOutput } from "./types";


export class MachineLearningTool {
  static readonly description =
    "SelectorTool 결과를 기반으로 추천된 ML 모델을 학습하고 평가합니다.";

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
