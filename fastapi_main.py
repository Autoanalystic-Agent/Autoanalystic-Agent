from fastapi import FastAPI, Request, UploadFile, File, Form, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
import os, subprocess, csv, json
from pathlib import Path
from typing import List, Dict

app = FastAPI()

UPLOAD_DIR = Path("src/uploads")
OUTPUT_DIR = Path("src/outputs")    # 생성물이 저장되는 폴더
UPLOAD_DIR.mkdir(exist_ok=True)
OUTPUT_DIR.mkdir(exist_ok=True)



# === Add: path → /outputs URL 매핑 유틸 ===
# [ADD] 단계(툴)별 상태·아티팩트 정리 유틸
import re

def _norm(p: str) -> str:
    return str(p).replace("\\", "/")

def path_to_outputs_url(path: str | None) -> str | None:
    if not path:
        return None
    p = Path(path)
    try:
        rel = p.relative_to(OUTPUT_DIR)
        return f"/outputs/{_norm(rel)}"
    except Exception:
        return f"/outputs/{_norm(p.name)}"

def map_artifacts(workflow: dict) -> dict:
    if not isinstance(workflow, dict):
        return workflow
    wf = dict(workflow)

    if wf.get("preprocessedFilePath"):
        wf["preprocessedFilePathUrl"] = path_to_outputs_url(wf["preprocessedFilePath"])

    mlp = dict(wf.get("mlResultPath") or {})
    if mlp.get("mlResultPath"):
        mlp["mlResultUrl"] = path_to_outputs_url(mlp["mlResultPath"])
    if mlp.get("reportPath"):
        mlp["reportUrl"] = path_to_outputs_url(mlp["reportPath"])
        # 보고서 텍스트가 깨졌으면 UTF-8로 재읽기 시도
        if mlp.get("report") and "�" in mlp["report"]:
            try:
                mlp["report"] = Path(mlp["reportPath"]).read_text(encoding="utf-8", errors="ignore")
            except Exception:
                pass
    wf["mlResultPath"] = mlp

    if isinstance(wf.get("chartPaths"), list):
        wf["chartUrls"] = [path_to_outputs_url(p) for p in wf["chartPaths"]]
    return wf

def build_steps(wf: dict) -> list[dict]:
    """워크플로 dict에서 단계(툴)별 완료 여부를 계산"""
    def st(key, title, ok):
        return {"key": key, "title": title, "status": "done" if ok else "skipped"}

    steps = []
    steps.append(st("basic",     "1) BasicAnalysisTool",            bool(wf.get("columnStats"))))
    steps.append(st("selector",  "2) SelectorTool",                 bool(wf.get("selectedColumns") or wf.get("recommendedPairs") or wf.get("preprocessingRecommendations"))))
    steps.append(st("visual",    "3) VisualizationTool",            bool(wf.get("chartUrls"))))
    steps.append(st("preprocess","4) PreprocessExecutorTool",       bool(wf.get("preprocessedFilePathUrl"))))
    ml_ok = bool( (wf.get("mlModelRecommendation") and wf["mlModelRecommendation"].get("model")) or
                  (wf.get("mlResultPath") and (wf["mlResultPath"].get("mlResultUrl") or wf["mlResultPath"].get("reportUrl"))) )
    steps.append(st("train",     "5) MachineLearningTool",          ml_ok))
    return steps

def looks_like_dump(text: str) -> bool:
    if not text:
        return False
    needles = [
        "[WorkflowTool", "BasicAnalysisTool", "SelectorTool",
        "VisualizationTool", "Preprocess", "MachineLearning",
        "columnStats", "recommendedPairs", "preprocessedFilePath",
        "mlResultPath", "reportPath", "chartPaths", "dtype:", "column:"
    ]
    return any(n in text for n in needles) or len(text) > 600

def coerce_to_json(s: str):
    """
    로그에 여러 JSON-유사 블록이 섞여 있을 때,
    - 키워드 포함 블록(columnStats 등) 우선
    - 없으면 가장 큰 블록
    을 골라 보정 후 json.loads 시도.
    """
    # 0) 정상 JSON 먼저
    try:
        return json.loads(s)
    except Exception:
        pass

    if not s or "{" not in s or "}" not in s:
        return None

    # 1) 모든 최상위 {…} 블록 추출 (문자열/이스케이프 인지)
    blocks = []
    depth = 0
    in_str = False
    esc = False
    start = None
    for i, ch in enumerate(s):
        if in_str:
            if esc:
                esc = False
            elif ch == "\\":
                esc = True
            elif ch == '"':
                in_str = False
            continue
        if ch == '"':
            in_str = True
            continue
        if ch == "{":
            if depth == 0:
                start = i
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0 and start is not None:
                blocks.append(s[start:i+1])
                start = None

    if not blocks:
        return None

    # 2) 키워드가 들어있는 블록을 우선, 없으면 길이순 내림차순
    prefer = ("columnStats", "selectedColumns", "mlModelRecommendation", "mlResultPath")
    blocks.sort(key=lambda b: (any(k in b for k in prefer), len(b)), reverse=True)

    # 3) 각 블록에 대해 보정 후 파싱 시도
    for core in blocks:
        try:
            # { key: ... } -> { "key": ... }
            core2 = re.sub(r'([,{]\s*)([A-Za-z_][A-Za-z0-9_]*)\s*:', r'\1"\2":', core)
            # ' -> "
            core2 = core2.replace("'", '"')
            # JS 특수값 → JSON 값
            core2 = core2.replace("undefined", "null")
            core2 = re.sub(r'\bNaN\b', 'null', core2)
            core2 = re.sub(r'\bInfinity\b', 'null', core2)
            core2 = re.sub(r'\b-Infinity\b', 'null', core2)
            # [Object] → {}
            core2 = re.sub(r'\[\s*Object\s*\]', "{}", core2)
            core2 = core2.replace("[Object], [Object]", "{}, {}")
            # 끝 콤마 제거
            core2 = re.sub(r',\s*([}\]])', r'\1', core2)
            return json.loads(core2)
        except Exception:
            continue

    return None




# Templates 설정
templates = Jinja2Templates(directory="templates")

# CORS 설정 (필요 없으면 삭제해도 됨)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# [ADD] 업로드된 CSV에서 상위 N행만 미리보기로 읽어오는 유틸
def load_head_preview(filename: str, limit: int = 5):
    cols, rows = [], []
    if not filename:
        return cols, rows
    path = UPLOAD_DIR / filename
    try:
        with path.open(newline="", encoding="utf-8") as csvfile:
            reader = csv.DictReader(csvfile)
            cols = reader.fieldnames or []
            for i, r in enumerate(reader):
                if i >= limit:
                    break
                rows.append(r)
    except Exception as e:
        print(f"CSV 미리보기 오류: {e}")
    return cols, rows


# 생성물 폴더를 /outputs 경로로 정적 서빙
app.mount("/outputs", StaticFiles(directory=str(OUTPUT_DIR)), name="outputs")

def list_generated_files() -> List[Dict]:
    """OUTPUT_DIR 내 생성물 파일 리스트를 dict 목록으로 반환"""
    files = []
    if OUTPUT_DIR.exists():
        for p in sorted(OUTPUT_DIR.glob("*")):
            if p.is_file():
                files.append({
                    "name": p.name,
                    "url": f"/outputs/{p.name}",
                    "size": p.stat().st_size,
                    "ext": p.suffix.lower(),
                })
    return files

@app.get("/", response_class=HTMLResponse)
async def home(request: Request, filename: str = Query(None)):
    head_columns = []
    head_rows = []

    if filename:
        file_path = UPLOAD_DIR / filename
        try:
            with file_path.open(newline="", encoding="utf-8") as csvfile:
                reader = csv.DictReader(csvfile)
                head_columns = reader.fieldnames or []
                for i, row in enumerate(reader):
                    if i >= 5:
                        break
                    head_rows.append(row)
        except Exception as e:
            print(f"CSV 읽기 오류: {e}")

    generated_files = list_generated_files()

    # 이미지 미리보기용 생성물 (확장자 기준)
    preview_images = [f for f in generated_files if f["ext"] in {".png", ".jpg", ".jpeg", ".gif", ".webp"}]

    return templates.TemplateResponse("index.html", {
        "request": request,
        "head_columns": head_columns,
        "head_rows": head_rows,
        "current_filename": filename,
        "generated_files": generated_files,
        "preview_images": preview_images,
    })


@app.post("/upload_csv/")
async def upload_csv(request: Request, file: UploadFile = File(...)):
    file_path = UPLOAD_DIR / file.filename
    with file_path.open("wb") as f:
        f.write(await file.read())
    print("업로드된 파일 이름:", file.filename)
    return RedirectResponse(url=f"/?filename={file.filename}", status_code=303)

# [ADD] 업로드된 파일로 워크플로우를 한 번에 실행하는 엔드포인트
@app.post("/run_workflow/", response_class=HTMLResponse)
async def run_workflow(request: Request, filename: str = Form(None)):
    # 파일이 없으면 안내만 보여줌
    if not filename:
        generated_files = list_generated_files()
        preview_images = [f for f in generated_files if f["ext"] in {".png", ".jpg", ".jpeg", ".gif", ".webp"}]
        return templates.TemplateResponse("index.html", {
            "request": request,
            "reply": "⚠️ 먼저 CSV를 업로드하세요.",
            "current_filename": None,
            "generated_files": generated_files,
            "preview_images": preview_images,
            "workflow": None,
            "steps": [],
        })

    # 기존 /chat 로직 재사용: 메시지를 '분석해줘'로 고정
    return await chat(request, message="분석해줘", filename=filename)


@app.post("/chat/", response_class=HTMLResponse)
async def chat(request: Request, message: str = Form(...), filename: str = Form(None)):
    print(f"채팅 요청: message={message}, filename={filename}")
    # 함수 위쪽 어딘가에 [ADD]
    def _text(x):
        return x.decode("utf-8", "replace").strip() if isinstance(x, (bytes, bytearray)) else (x or "").strip()


    try:
        cmd = ["npx", "ts-node", "src/main.ts", message]
        if filename:
            file_path = UPLOAD_DIR / filename
            cmd.append(str(file_path))
            print(file_path)

        proc = subprocess.Popen(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            shell=True,
            text=True,              # [ADD] 문자열로 직접 받기
            encoding="utf-8",       # [ADD] UTF-8 고정
            errors="replace"        # [ADD] 깨진 문자는 대체
        )
        stdout, stderr = proc.communicate(timeout=600)

        if proc.returncode != 0:
            reply = f"❌ 오류: {stderr.strip()}"
        else:
            try:
                output_str = (stdout or "").strip() 
                print("stdout decoded:", output_str)
                response_json = coerce_to_json(output_str)   # [MOD]
                if not response_json:
                    raise ValueError("json parse failed")

                chat_answers = response_json.get("answers", [])
                chat_history = [{"role": "user", "content": message}]
                
                for answer in chat_answers:
                    content = (answer.get("message") or {}).get("content", "")
                    if content and not looks_like_dump(content):
                        chat_history.append({"role": "bot", "content": content})
                    elif content:
                        chat_history.append({"role": "bot", "content": "👉 아래 단계별 카드에서 분석 결과를 확인하세요."})

                generated_files = list_generated_files()
                preview_images = [f for f in generated_files if f["ext"] in {".png", ".jpg", ".jpeg", ".gif", ".webp"}]

                
                # ========= [ADD] 워크플로 추출 및 산출물 URL 매핑 =========
                workflow = None
                candidates = [
                    response_json.get("workflow"),
                    response_json.get("result"),
                    response_json,  # 최상위가 곧 워크플로일 수도 있음
                ]
                for cand in candidates:
                    if isinstance(cand, dict) and (
                        "columnStats" in cand or "mlModelRecommendation" in cand
                    ):
                        workflow = cand
                        break

                workflow_mapped = map_artifacts(workflow) if workflow else None
                # ========= [ADD] 끝 =========
                
                steps = build_steps(workflow_mapped) if workflow_mapped else []  # [ADD]
                head_columns, head_rows = load_head_preview(filename) if filename else ([], [])

                return templates.TemplateResponse("index.html", {
                    "request": request,
                    "chat_history": chat_history,
                    "current_filename": filename,
                    "generated_files": generated_files,
                    "preview_images": preview_images,
                    # ========= [ADD] 템플릿에 워크플로 전달 =========
                    "workflow": workflow_mapped,
                    "steps": steps,
                    "head_columns": head_columns,
                    "head_rows": head_rows,
                    # ============================================
                })

            except Exception:
                reply = f"⚠️ JSON 파싱 실패:\n{(stdout or'').strip()}"


        generated_files = list_generated_files()
        preview_images = [f for f in generated_files if f["ext"] in {".png", ".jpg", ".jpeg", ".gif", ".webp"}]
        head_columns, head_rows = load_head_preview(filename) if filename else ([], [])


        return templates.TemplateResponse("index.html", {
            "request": request,
            "reply": reply,
            "current_filename": filename,
            "generated_files": generated_files,
            "preview_images": preview_images,
            # ========= [ADD] 에러 시에도 키 존재하도록 =========
            "workflow": None,
            "steps": [],
            "head_columns": head_columns,
            "head_rows": head_rows,
            # ==============================================
        })

    except subprocess.TimeoutExpired:
        generated_files = list_generated_files()
        preview_images = [f for f in generated_files if f["ext"] in {".png", ".jpg", ".jpeg", ".gif", ".webp"}]

        return templates.TemplateResponse("index.html", {
            "request": request,
            "reply": "⚠️ 응답 시간 초과",
            "current_filename": filename,
            "generated_files": generated_files,
            "preview_images": preview_images,
            # ========= [ADD] 에러 시에도 키 존재하도록 =========
            "workflow": None,
            "steps": [],
            # ==============================================
        })
