import { exec } from "child_process";
import { VisualizationInput } from "./types";
import fs from "fs";
import path from "path";

export class VisualizationTool {
  static readonly description =
    "선택된 컬럼/페어 기반의 단·이변량 시각화를 생성하고 결과 이미지 경로를 반환합니다.";

  // ✅ 시그니처를 공통 타입으로 교체 (기존 로직은 그대로 유지)
  async run(input: VisualizationInput): Promise<string[]> {
    // ✅ 기존 구조분해 + correlation(선택) 추가
    const { filePath, selectorResult, correlation } = input;

    const sessionId = input.sessionId;
    console.log(input.sessionId)
    // 1. 출력 폴더 생성
    const timestamp = Date.now();
    const outputDir = input.sessionId
          ? path.join(process.cwd(), "src/outputs", input.sessionId) // 세션별 출력
          : path.join(process.cwd(), "src/outputs");
    
    console.log(outputDir)
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
          .map((f) => `/${outputDir}/${f}`)
          .map((u) => u.replace(/\\/g, "/"));          // 윈도우 역슬래시 → 슬래시

        // ✅ CorrelationTool이 생성한 히트맵이 있으면 함께 반환 목록에 포함
        //    (예: correlation.heatmapPath === "src/outputs/corr_heatmap_123.png")
        if (correlation?.heatmapPath && fs.existsSync(correlation.heatmapPath)) {
          const basename = path.basename(correlation.heatmapPath);
          const webUrl = `/${outputDir}/${basename}`.replace(/\\/g, "/");
          if (!urls.includes(webUrl)) urls.push(webUrl);
        }

        resolve(urls);
      });
    });
  }
}
