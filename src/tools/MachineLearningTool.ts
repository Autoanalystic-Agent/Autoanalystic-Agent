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

  // [ADD] /outputs/... → 실제 파일경로로 매핑
  private toFsPath(p: string) {
    if (!p) return p;
    const norm = p.replace(/\\/g, "/");
    if (norm.startsWith("/outputs/")) {
      // "/outputs/..."  → "<cwd>/outputs/..."
      return path.join(process.cwd(), norm.slice(1));
    }
    if (norm.startsWith("outputs/")) {
      // "outputs/..."   → "<cwd>/outputs/..."
      return path.join(process.cwd(), norm);
    }
    // 이미 절대경로면 그대로, 아니면 절대경로화
    return path.isAbsolute(p) ? p : path.resolve(p);
  }


  // [ADD] 파일경로를 웹경로로 변환 (UI 노출용)
  private toWebUrl(absOrRelPath: string) {
    const abs = path.resolve(absOrRelPath).replace(/\\/g, "/");
    const idx = abs.lastIndexOf("/outputs/");
    const relFromOutputs = idx >= 0 ? abs.slice(idx + 1) : `outputs/${path.basename(abs)}`;
    return `/${relFromOutputs}`.replace(/\\/g, "/");
  }


  async run(input: MachineLearningInput): Promise<MachineLearningOutput> {
    const { filePath, selectorResult } = input;

    const timestamp = Date.now();
    // ✅ 파이썬에 넘길 입력 CSV 경로는 "무조건" 파일시스템 경로로 정규화
    const fsFilePath = this.toFsPath(filePath);                 // [ADD]
    const outputDir  = this.toFsPath(input.outputDir ?? "outputs"); // [CHG]
    fs.mkdirSync(outputDir, { recursive: true });

    // 2. Python 실행 커맨드 구성
    const pythonScriptPath = "src/scripts/train_ml_model.py";
    const selectorJsonEscaped = JSON.stringify(selectorResult).replace(/"/g, '\\"');
    const command = `python ${pythonScriptPath} "${filePath}" "${selectorJsonEscaped}" "${outputDir}" ${timestamp}`;

    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error("[MachineLearningTool 에러]", stderr);
          reject(new Error(stderr?.toString() || "ML 실행 실패"));
          return;
        }

        // [ADD] 이번 실행에서 생성된 기대 파일명 우선 탐색
        const expectedReport = path.join(outputDir, `ml_result_${timestamp}.txt`);
        const expectedModel  = path.join(outputDir, `model_${timestamp}.pkl`);

        // 보고서
        let reportAbs = fs.existsSync(expectedReport)
          ? expectedReport
          : (() => {
              // 보조: 가장 최근 txt/md/html
              const cands = fs.readdirSync(outputDir)
                .filter(f => /\.(txt|md|html)$/i.test(f))
                .map(f => path.join(outputDir, f))
                .sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);
              // 그래도 없으면 stdout 저장
              if (cands.length === 0) {
                fs.writeFileSync(expectedReport, (stdout || "").toString(), "utf-8");
                return expectedReport;
              }
              return cands[0];
            })();

        // 모델(pkl)은 없어도 에러로 막지 않음
        let modelAbs = fs.existsSync(expectedModel) ? expectedModel : null;
        if (!modelAbs) {
          const pkl = fs.readdirSync(outputDir)
            .filter(f => /\.pkl$/i.test(f))
            .map(f => path.join(outputDir, f))
            .sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs)[0];
          modelAbs = pkl || null;
        }


        // ✅ 반환 표면: MachineLearningOutput
        // - FastAPI map_artifacts()는 reportPath를 우선 매핑하여 /outputs 링크를 붙임
        // - modelPath/rawLog는 추가 정보 (UI에서 안 쓰면 무시됨)
        const out: MachineLearningOutput = {
          reportPath: this.toWebUrl(reportAbs),
          modelPath: modelAbs ? this.toWebUrl(modelAbs) : undefined, // [ADD]
          rawLog: (stdout || "").toString().trim(),
        };

        resolve(out);        
      });
    });
  }
}
