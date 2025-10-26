import { exec } from "child_process";
import { VisualizationInput, VisualizationOutput } from "./types";
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
  async run(input: VisualizationInput): Promise<VisualizationOutput> {
    // ✅ 기존 구조분해 + correlation(선택) 추가
    const { filePath, selectorResult, correlation } = input;

    const sessionId = input.sessionId ?? "";
    console.log(input.sessionId)
    // 1. 출력 폴더 생성
    const outputDir = sessionId
          ? path.join(process.cwd(), "src/outputs", sessionId) // 세션별 출력
          : path.join(process.cwd(), "src/outputs");
    fs.mkdirSync(outputDir, { recursive: true });
    
    const webBase = sessionId ? `/outputs/${sessionId}` : `/outputs`;
    const timestamp = Date.now();

    // 2. Python 실행 커맨드 구성
    const pythonScriptPath = "src/scripts/visualize_from_json.py";
    const selectorJsonEscaped = JSON.stringify(selectorResult).replace(/"/g, '\\"');

    const command = `python ${pythonScriptPath} "${filePath}" "${selectorJsonEscaped}" "${outputDir}" ${timestamp}`;
    const urls: string[] = [];

    await new Promise<void>((resolve, reject) => {
      exec(command, (error, _stdout, stderr) => {
        if (error) return reject(new Error(stderr?.toString() || "VisualizationTool error"));


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
        for (const f of files) urls.push(`${webBase}/${f}`.replace(/\\/g, "/"));
        resolve();
      });
    });

    // (선택) heatmap 포함/복사
    if (correlation?.heatmapPath && fs.existsSync(correlation.heatmapPath)) {
      try {
        const src = path.resolve(correlation.heatmapPath);
        const base = path.basename(src);
        const dst = path.join(outputDir, base);
        if (!fs.existsSync(dst)) {
          try { fs.copyFileSync(src, dst); }
          catch {
            const ext = path.extname(base);
            const name = path.basename(base, ext);
            const alt = path.join(outputDir, `${name}_${timestamp}${ext}`);
            fs.copyFileSync(src, alt);
            urls.push(`${webBase}/${path.basename(alt)}`.replace(/\\/g, "/"));
          }
        }
        const web = `${webBase}/${path.basename(dst)}`.replace(/\\/g, "/");
        if (!urls.includes(web)) urls.push(web);
      } catch { /* 조용히 무시 */ }
    }

    // ✅ 모든 경로에서 값 반환
    return { chartPaths: urls };
  }
}
