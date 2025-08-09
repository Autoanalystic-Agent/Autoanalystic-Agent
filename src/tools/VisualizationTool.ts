import { exec } from "child_process";
import fs from "fs";
import path from "path";

export class VisualizationTool {
  static readonly description =
    "SelectorTool 결과를 기반으로 추천된 컬럼 페어를 시각화합니다.";

  async run({
    filePath,
    selectorResult,
  }: {
    filePath: string; // csv 파일 경로
    selectorResult: { // selectorTool의 출력값
      selectedColumns: string[];
      recommendedPairs: { column1: string; column2: string }[];
    };
  }): Promise<string[]> {
    // 1. 출력 폴더 생성
    const timestamp = Date.now();
    const outputDir = path.join("src/outputs");
    fs.mkdirSync(outputDir, { recursive: true });

    // 2. Python 실행 커맨드 구성
    const pythonScriptPath = "src/scripts/visualize_from_json.py";
    const selectorJsonEscaped = JSON.stringify(selectorResult).replace(/"/g, '\\"');

    const command = `python ${pythonScriptPath} "${filePath}" "${selectorJsonEscaped}" "${outputDir}" ${timestamp}`;

    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error("[VisualizationTool 에러]", stderr);
          reject(stderr);
        } else {
          const imageFiles = fs
            .readdirSync(outputDir)
            .filter((f) => f.endsWith(".png") && f.includes(String(timestamp)))
            .map((f) => path.join("outputs", f));
          resolve(imageFiles);
        }
      });
    });
  }
}
