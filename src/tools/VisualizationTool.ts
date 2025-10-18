import { exec } from "child_process";
import { VisualizationInput } from "./types";
import fs from "fs";
import path from "path";

export class VisualizationTool {
  static readonly description =
    "선택된 컬럼/페어 기반의 단·이변량 시각화를 생성하고 결과 이미지 경로를 반환합니다.";

  /**
   * (프롬프트 추가) — 로직/타입/메서드는 변경하지 않음
   * LLM/에이전트가 이 도구의 목적과 입출력, 제약을 이해하도록 돕는 설명 문자열입니다.
   */
  readonly prompt = `
[SYSTEM]
너는 선택 컬럼과 추천 페어를 받아 차트 파일을 생성하는 시각화 도구다.
출력은 반드시 JSON 한 줄.

[DEVELOPER]
입력:
- filePath: {{filePath}}
- selectorResult: { selectedColumns: string[], recommendedPairs: {column1,column2}[] }
- correlation?: { matrixPath?: string; heatmapPath?: string }

규칙:
- recommendedPairs 각각에 대해 산점도/박스/바 등 의미있는 1~2개 기본 차트 생성.
- correlation.matrixPath(상관행렬 CSV)가 있으면 heatmap PNG를 추가로 생성 가능.
- 파일은 OUTPUT_DIR에 저장하고 상대 경로 배열 반환.

출력(VisualizationOutput):
{ "chartPaths": string[] }

제약:
- 파일 생성 실패 항목은 조용히 스킵.
- 로그 문장 출력 금지.

[USER]
입력 파일: {{filePath}}, 추천 페어 개수: {{pairCount}}
  `.trim();

  // ✅ 시그니처를 공통 타입으로 교체 (기존 로직은 그대로 유지)
  async run(input: VisualizationInput): Promise<string[]> {
    // ✅ 기존 구조분해 + correlation(선택) 추가
    const { filePath, selectorResult, correlation } = input;

    // 1. 출력 폴더 생성
    const timestamp = Date.now();
    const outputDir = input.outputDir ?? path.join("outputs"); // [CHG] 루트 outputs 기본값
    fs.mkdirSync(outputDir, { recursive: true });

    // 2. Python 실행 커맨드 구성
    const pythonScriptPath = "src/scripts/visualize_from_json.py";
    const selectorJsonEscaped = JSON.stringify(selectorResult).replace(/"/g, '\\"');

    const command = `python ${pythonScriptPath} "${filePath}" "${selectorJsonEscaped}" "${outputDir}" ${timestamp}`;

    // [ADD] 웹 경로로 변환하는 헬퍼: outputDir 내 파일을 /outputs/... 형태 URL로 변환
    const toWebUrl = (absOrRelPath: string) => {                      // [ADD]
      // 1) 절대경로화
      const abs = path.resolve(absOrRelPath);
      // 2) outputs 루트부터의 상대경로를 추출
      //    예: /project/outputs/anon/.../viz → outputs/anon/.../viz
      const norm = abs.replace(/\\/g, "/");
      const idx = norm.lastIndexOf("/outputs/");
      // 서버가 outputs/를 정적 서빙한다고 가정 (/outputs/*)
      const relFromOutputs = idx >= 0 ? norm.slice(idx + 1) : `outputs/${path.basename(abs)}`;
      return `/${relFromOutputs}`.replace(/\\/g, "/");
    };    

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
        let files: string[];
        if (input.outputDir) {
          // [ADD] 세션 전용 폴더이면 해당 폴더의 이미지 모두 수집
          files = fs.readdirSync(outputDir)
            .filter((f) => /\.(png|jpg|jpeg|webp|gif)$/i.test(f))
            .map((f) => path.join(outputDir, f));
        } else {
          // 공유 폴더 fallback일 때만 mtime 필터로 이번 실행분 추림
          files = fs.readdirSync(outputDir)
            .filter((f) => /\.(png|jpg|jpeg|webp|gif)$/i.test(f))
            .filter((f) => {
              try {
                const stat = fs.statSync(path.join(outputDir, f));
                return stat.mtimeMs >= timestamp - 2000;
              } catch { return false; }
            })
            .map((f) => path.join(outputDir, f));
        }

        // 웹에서 접근 가능한 URL로 변환
        const urls = files.map(toWebUrl); // [CHG]

        // ✅ CorrelationTool이 생성한 히트맵이 있으면 함께 반환 목록에 포함
        //    (예: correlation.heatmapPath === "src/outputs/corr_heatmap_123.png")
        if (correlation?.heatmapPath && fs.existsSync(correlation.heatmapPath)) {
          const webUrl = toWebUrl(correlation.heatmapPath); // [CHG]
          if (!urls.includes(webUrl)) urls.push(webUrl);
        }

        resolve(urls);
      });
    });
  }
}
