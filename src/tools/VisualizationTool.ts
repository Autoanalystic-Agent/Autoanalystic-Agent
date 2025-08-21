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
          return;
        }
        // } else {
        //   const imageFiles = fs
        //     .readdirSync(outputDir)
        //     .filter((f) => f.endsWith(".png") && f.includes(String(timestamp)))
        //     .map((f) => path.join("outputs", f));
        //   resolve(imageFiles);
        // }
        
        // ① 확장자 기준으로 이미지 수집
        // ② 이번 실행에 생성된 파일만 포함(수정시각으로 필터) — 타임스탬프 의존 제거
        const files = fs.readdirSync(outputDir)
          .filter((f) => /\.(png|jpg|jpeg|webp|gif)$/i.test(f))
          .filter((f) => {
            try {
              const stat = fs.statSync(path.join(outputDir, f));
              return stat.mtimeMs >= timestamp - 2000; // 여유 2초
            } catch { return false; }
          });

        // 웹에서 접근 가능한 URL로 변환 (항상 슬래시 사용, 선행 슬래시 포함)
        const urls = files
          .map((f) => `/outputs/${f}`)
          .map((u) => u.replace(/\\/g, "/"));          // 윈도우 역슬래시 → 슬래시

        resolve(urls);
      });
    });
  }
}
