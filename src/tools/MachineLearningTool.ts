import { exec } from "child_process";
import fs from "fs";
import path from "path";

export interface MLSelectorResult {
  targetColumn: string;
  problemType: "regression" | "classification";
  mlModelRecommendation: {
    model: string;
    score: number;
    reason: string;
    params: Record<string, any>;
  };
}

export class MachineLearningTool {
  static readonly description =
    "SelectorTool 결과를 기반으로 추천된 ML 모델을 학습하고 평가합니다.";

  async run({
    filePath,
    selectorResult,
  }: {
    filePath: string; // CSV 파일 경로
    selectorResult: MLSelectorResult; // SelectorTool 출력값
  }): Promise<{ mlResultPath: string; reportPath:string; report: string }> {

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
        } else {
          // Python에서 결과 파일명을 stdout으로 출력한다고 가정
          const mlResultFile = fs
            .readdirSync(outputDir)
            .filter((f) => f.endsWith(".pkl") && f.includes(String(timestamp)))[0];

          if (!mlResultFile) {
            reject("ML 결과 파일을 찾을 수 없습니다.");
            return;
          }

          resolve({
            mlResultPath: path.join("src/outputs", mlResultFile),
            reportPath: path.join("src/outputs", `${timestamp}_report.txt`),
            report: stdout.toString().trim(),
          });
        }
      });
    });
  }
}
