from fastapi import FastAPI, Request, UploadFile, File, Form, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from pathlib import Path
import uuid, subprocess, json, re
from typing import List, Dict

app = FastAPI()

# ------------------------------
# 폴더 경로 설정
# ------------------------------
UPLOAD_DIR = Path("src/uploads")
OUTPUT_DIR = Path("src/outputs")
UPLOAD_DIR.mkdir(exist_ok=True)
OUTPUT_DIR.mkdir(exist_ok=True)

# ------------------------------
# Jinja2 템플릿
# ------------------------------
templates = Jinja2Templates(directory="templates")

# ------------------------------
# CORS
# ------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------------
# 정적 파일
# ------------------------------
app.mount("/outputs", StaticFiles(directory=str(OUTPUT_DIR)), name="outputs")

# ------------------------------
# 세션 관리
# ------------------------------
session_files: Dict[str, str] = {}
chat_histories: Dict[str, List[Dict]] = {}

# ------------------------------
# CSV 미리보기
# ------------------------------
def get_csv_preview(file_path: str):
    head_columns, head_rows = [], []
    describe_columns, describe_rows = [], []

    try:
        import pandas as pd
        df = pd.read_csv(file_path)
        head_rows = df.head().to_dict(orient="records")
        head_columns = df.columns.tolist()

        describe_df = df.describe(include="all").reset_index()
        describe_rows = describe_df.to_dict(orient="records")
        describe_columns = describe_df.columns.tolist()
    except Exception as e:
        print(f"CSV 미리보기 오류: {e}")

    return head_columns, head_rows, describe_columns, describe_rows

# ------------------------------
# JSON 보정
# ------------------------------
def coerce_to_json(s: str):
    try:
        return json.loads(s)
    except Exception:
        pass
    if not s or "{" not in s or "}" not in s:
        return None

    blocks = []
    depth, in_str, esc, start = 0, False, False, None
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

    prefer = ("columnStats", "selectedColumns", "mlModelRecommendation", "mlResultPath")
    blocks.sort(key=lambda b: (any(k in b for k in prefer), len(b)), reverse=True)

    for core in blocks:
        try:
            core2 = re.sub(r'([,{]\s*)([A-Za-z_][A-Za-z0-9_]*)\s*:', r'\1"\2":', core)
            core2 = core2.replace("'", '"').replace("undefined", "null")
            core2 = re.sub(r'\bNaN\b', 'null', core2)
            core2 = re.sub(r'\bInfinity\b', 'null', core2)
            core2 = re.sub(r'\b-Infinity\b', 'null', core2)
            core2 = re.sub(r'\[\s*Object\s*\]', '{}', core2)
            core2 = core2.replace("[Object], [Object]", "{}, {}")
            core2 = re.sub(r',\s*([}\]])', r'\1', core2)
            return json.loads(core2)
        except Exception:
            continue
    return None

# ------------------------------
# 생성물 리스트
# ------------------------------
def list_generated_files() -> List[dict]:
    files = []
    for p in sorted(OUTPUT_DIR.glob("*")):
        if p.is_file():
            files.append({
                "name": p.name,
                "url": f"/outputs/{p.name}",
                "size": p.stat().st_size,
                "ext": p.suffix.lower(),
            })
    return files

# ------------------------------
# 홈
# ------------------------------
@app.get("/", response_class=HTMLResponse)
async def home(request: Request, sessionId: str = Query(None)):
    file_path = session_files.get(sessionId)
    chat_history = chat_histories.get(sessionId, [])

    head_columns, head_rows, describe_columns, describe_rows = [], [], [], []
    if file_path:
        head_columns, head_rows, describe_columns, describe_rows = get_csv_preview(file_path)

    generated_files = list_generated_files()
    preview_images = [f for f in generated_files if f["ext"] in {".png", ".jpg", ".jpeg", ".gif", ".webp"}]

    return templates.TemplateResponse("index.html", {
        "request": request,
        "chat_history": chat_history,
        "current_sessionId": sessionId,
        "head_columns": head_columns,
        "head_rows": head_rows,
        "describe_columns": describe_columns,
        "describe_rows": describe_rows,
        "generated_files": generated_files,
        "preview_images": preview_images,
    })

# ------------------------------
# CSV 업로드
# ------------------------------
@app.post("/upload_csv/")
async def upload_csv(request: Request, file: UploadFile = File(...)):
    file_path = UPLOAD_DIR / file.filename
    with file_path.open("wb") as f:
        f.write(await file.read())

    # filename 기준으로 저장
    session_files[file.filename] = str(file_path)
    chat_histories[file.filename] = []

    head_columns, head_rows, describe_columns, describe_rows = get_csv_preview(str(file_path))

    return templates.TemplateResponse("index.html", {
        "request": request,
        "current_filename": file.filename,
        "chat_history": chat_histories[file.filename],
        "workflow": None,
        "steps": [],
        "generated_files": list_generated_files(),
        "preview_images": [],
        "head_columns": head_columns,
        "head_rows": head_rows,
        "describe_columns": describe_columns,
        "describe_rows": describe_rows,
    })

# ------------------------------
# 채팅
# ------------------------------
@app.post("/chat/", response_class=HTMLResponse)
async def chat(request: Request, message: str = Form(...), filename: str = Form(...)):
    if not filename or filename not in session_files:
        reply = "⚠️ 파일이 유효하지 않습니다. CSV를 먼저 업로드해주세요."
        return templates.TemplateResponse("index.html", {"request": request, "reply": reply})

    file_path = session_files[filename]
    chat_history = chat_histories.get(filename, [])
    chat_history.append({"role": "user", "content": message})

    try:
        cmd = ["npx", "ts-node", "src/main.ts", message, file_path, filename]
        proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True)
        stdout, stderr = proc.communicate(timeout=600)
        output_str = stdout.decode("utf-8").strip()

        parsed_json = coerce_to_json(output_str)
        if parsed_json and "answers" in parsed_json:
            chat_history.append({"role": "bot", "content": "👉 아래 단계별 카드에서 분석 결과를 확인하세요."})
        else:
            chat_history.append({"role": "bot", "content": output_str})

        chat_histories[filename] = chat_history

        head_columns, head_rows, describe_columns, describe_rows = get_csv_preview(file_path)
        generated_files = list_generated_files()
        preview_images = [f for f in generated_files if f["ext"] in {".png", ".jpg", ".jpeg", ".gif", ".webp"}]

        return templates.TemplateResponse("index.html", {
            "request": request,
            "chat_history": chat_history,
            "current_filename": filename,
            "head_columns": head_columns,
            "head_rows": head_rows,
            "describe_columns": describe_columns,
            "describe_rows": describe_rows,
            "generated_files": generated_files,
            "preview_images": preview_images,
        })

    except subprocess.TimeoutExpired:
        reply = "⚠️ 응답 시간 초과"
        chat_history.append({"role": "bot", "content": reply})
        chat_histories[filename] = chat_history
        return templates.TemplateResponse("index.html", {
            "request": request,
            "chat_history": chat_history,
            "reply": reply,
            "current_filename": filename,
        })

# ------------------------------
# 워크플로우 자동 실행
# ------------------------------
@app.post("/run_workflow/", response_class=HTMLResponse)
async def run_workflow(request: Request, filename: str = Form(...)):
    if not filename or filename not in session_files:
        reply = "⚠️ 파일이 유효하지 않습니다. CSV를 먼저 업로드해주세요."
        return templates.TemplateResponse("index.html", {"request": request, "reply": reply})

    file_path = session_files[filename]
    chat_history = chat_histories.get(filename, [])

    try:
        cmd = ["npx", "ts-node", "src/main.ts", "분석해줘", file_path, filename]
        proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True)
        stdout, stderr = proc.communicate(timeout=600)
        output_str = stdout.decode("utf-8").strip()

        workflow_json = coerce_to_json(output_str)
        workflow = workflow_json if isinstance(workflow_json, dict) else None

        head_columns, head_rows, describe_columns, describe_rows = get_csv_preview(file_path)
        generated_files = list_generated_files()
        preview_images = [f for f in generated_files if f["ext"] in {".png", ".jpg", ".jpeg", ".gif", ".webp"}]

        return templates.TemplateResponse("index.html", {
            "request": request,
            "chat_history": chat_history,
            "current_filename": filename,
            "workflow": workflow,
            "steps": [],
            "head_columns": head_columns,
            "head_rows": head_rows,
            "describe_columns": describe_columns,
            "describe_rows": describe_rows,
            "generated_files": generated_files,
            "preview_images": preview_images,
        })

    except subprocess.TimeoutExpired:
        reply = "⚠️ 응답 시간 초과"
        chat_history.append({"role": "bot", "content": reply})
        chat_histories[filename] = chat_history
        return templates.TemplateResponse("index.html", {
            "request": request,
            "chat_history": chat_history,
            "reply": reply,
            "current_filename": filename,
        })
