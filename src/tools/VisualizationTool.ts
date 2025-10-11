import { exec } from "child_process";
import { VisualizationInput } from "./types";
import fs from "fs";
import path from "path";

export class VisualizationTool {
  static readonly description =
  "선택된 컬럼과 컬럼 페어를 기반으로 단·이변량 시각화를 생성합니다. \
  연속형 숫자 컬럼은 히스토그램 또는 scatter plot, 범주형 컬럼은 막대그래프 사용. \
  상관계수 0.7 이상인 컬럼쌍은 scatter plot으로 강조. \
  차트 개수는 최대 5개, 각 차트에는 컬럼명과 범례를 표시. \
  결과는 이미지 파일 경로 배열로 반환.";


  // ✅ 시그니처를 공통 타입으로 교체 (기존 로직은 그대로 유지)
  async run(input: VisualizationInput): Promise<string[]> {
    // ✅ 기존 구조분해 + correlation(선택) 추가
    const { filePath, selectorResult, correlation } = input;

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

        // ✅ CorrelationTool이 생성한 히트맵이 있으면 함께 반환 목록에 포함
        //    (예: correlation.heatmapPath === "src/outputs/corr_heatmap_123.png")
        if (correlation?.heatmapPath && fs.existsSync(correlation.heatmapPath)) {
          const basename = path.basename(correlation.heatmapPath);
          const webUrl = `/outputs/${basename}`.replace(/\\/g, "/");
          if (!urls.includes(webUrl)) urls.push(webUrl);
        }

        resolve(urls);
      });
    });
  }
}
