from fastapi import FastAPI, Request, UploadFile, File, Form, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from typing import List, Dict
import subprocess, json

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
# 정적 파일 (생성물)
# ------------------------------
app.mount("/outputs", StaticFiles(directory=str(OUTPUT_DIR)), name="outputs")

# ------------------------------
# 파일별 AgenticaHistory 저장
# {filename: AgenticaHistory}
# ------------------------------
from typing import Any
chat_histories: Dict[str, List[Dict[str, Any]]] = {}

# ------------------------------
# 생성물 리스트
# ------------------------------
def list_generated_files() -> List[Dict]:
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
# CSV 미리보기
# ------------------------------
def get_csv_preview(filename: str):
    head_columns, head_rows = [], []
    describe_rows, describe_columns = [], []

    try:
        import pandas as pd
        file_path = UPLOAD_DIR / filename
        df = pd.read_csv(file_path)

        head_rows = df.head().to_dict(orient="records")
        head_columns = df.columns.tolist()

        describe_df = df.describe(include="all").reset_index()
        describe_rows = describe_df.to_dict(orient="records")
        describe_columns = describe_df.columns.tolist()

    except Exception as e:
        print(f"CSV 미리보기 오류: {e}")

    return head_columns, head_rows, describe_columns, describe_rows

def coerce_to_json(s: str):
    """
    여러 JSON-유사 블록이 섞여 있을 때,
    - 특정 키워드 포함 블록 우선
    - 없으면 가장 큰 블록
    를 골라 json.loads 시도
    """
    import json

    # 0) 정상 JSON 먼저
    try:
        return json.loads(s)
    except Exception:
        pass

    if not s or "{" not in s or "}" not in s:
        return None

    # 1) 모든 최상위 {…} 블록 추출
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

    # 2) 키워드 포함 블록 우선, 없으면 길이순
    prefer = ("columnStats", "selectedColumns", "mlModelRecommendation", "mlResultPath")
    blocks.sort(key=lambda b: (any(k in b for k in prefer), len(b)), reverse=True)

    # 3) 각 블록 보정 후 파싱
    for core in blocks:
        try:
            core2 = re.sub(r'([,{]\s*)([A-Za-z_][A-Za-z0-9_]*)\s*:', r'\1"\2":', core)
            core2 = core2.replace("'", '"')
            core2 = core2.replace("undefined", "null")
            core2 = re.sub(r'\bNaN\b', 'null', core2)
            core2 = re.sub(r'\bInfinity\b', 'null', core2)
            core2 = re.sub(r'\b-Infinity\b', 'null', core2)
            core2 = re.sub(r'\[\s*Object\s*\]', "{}", core2)
            core2 = core2.replace("[Object], [Object]", "{}, {}")
            core2 = re.sub(r',\s*([}\]])', r'\1', core2)
            return json.loads(core2)
        except Exception:
            continue

    return None

# ------------------------------
# Home
# ------------------------------
@app.get("/", response_class=HTMLResponse)
async def home(request: Request, filename: str = Query(None)):
    head_columns, head_rows = [], []
    df_info_text, describe_columns, describe_rows = None, [], []

    if filename:
        head_columns, head_rows, describe_columns, describe_rows = get_csv_preview(filename)

    generated_files = list_generated_files()
    preview_images = [f for f in generated_files if f["ext"] in {".png", ".jpg", ".jpeg", ".gif", ".webp"}]

    # AgenticaHistory 불러오기
    chat_history = chat_histories.get(filename, [])

    return templates.TemplateResponse("index.html", {
        "request": request,
        "head_columns": head_columns,
        "head_rows": head_rows,
        "describe_columns": describe_columns,
        "describe_rows": describe_rows,
        "current_filename": filename,
        "generated_files": generated_files,
        "preview_images": preview_images,
        "chat_history": chat_history,
    })

# ------------------------------
# CSV 업로드
# ------------------------------
@app.post("/upload_csv/")
async def upload_csv(request: Request, file: UploadFile = File(...)):
    file_path = UPLOAD_DIR / file.filename
    with file_path.open("wb") as f:
        f.write(await file.read())
    print("업로드된 파일 이름:", file.filename)
    return RedirectResponse(url=f"/?filename={file.filename}", status_code=303)

# ------------------------------
# 채팅
# ------------------------------
@app.post("/chat/", response_class=HTMLResponse)
async def chat(request: Request, message: str = Form(...), filename: str = Form(None)):
    if not filename:
        reply = "⚠️ CSV 파일을 먼저 업로드해주세요."
        return templates.TemplateResponse("index.html", {"request": request, "reply": reply})

    chat_history = chat_histories.get(filename, [])
    chat_history.append({"role": "user", "content": message})

    try:
        import subprocess
        cmd = ["npx", "ts-node", "src/main.ts", message, str(UPLOAD_DIR / filename)]
        proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True)
        stdout, stderr = proc.communicate(timeout=600)

        output_str = stdout.decode("utf-8").strip()

        if stderr:
            reply = f"❌ 오류: {stderr.decode('utf-8').strip()}"
            chat_history.append({"role": "bot", "content": reply})
        else:
            parsed_json = coerce_to_json(output_str)
            if parsed_json and "answers" in parsed_json:
                for ans in parsed_json["answers"]:
                    content = ans.get("message", {}).get("content")
                    if content:
                        chat_history.append({"role": "bot", "content": content})
            else:
                # JSON 못 파싱하면 그대로 텍스트 출력
                chat_history.append({"role": "bot", "content": output_str})

        chat_histories[filename] = chat_history

        head_columns, head_rows, describe_columns, describe_rows = get_csv_preview(filename)
        generated_files = list_generated_files()
        preview_images = [f for f in generated_files if f["ext"] in {".png", ".jpg", ".jpeg", ".gif", ".webp"}]

        return templates.TemplateResponse("index.html", {
            "request": request,
            "chat_history": chat_history,
            "current_filename": filename,
            "generated_files": generated_files,
            "preview_images": preview_images,
            "head_columns": head_columns,
            "head_rows": head_rows,
            "describe_columns": describe_columns,
            "describe_rows": describe_rows,
        })

    except subprocess.TimeoutExpired:
        reply = "⚠️ 응답 시간 초과"
        chat_history.append({"role": "bot", "content": reply})
        chat_histories[filename] = chat_history

        head_columns, head_rows, describe_columns, describe_rows = get_csv_preview(filename)
        generated_files = list_generated_files()
        preview_images = [f for f in generated_files if f["ext"] in {".png", ".jpg", ".jpeg", ".gif", ".webp"}]

        return templates.TemplateResponse("index.html", {
            "request": request,
            "chat_history": chat_history,
            "reply": reply,
            "current_filename": filename,
            "generated_files": generated_files,
            "preview_images": preview_images,
            "head_columns": head_columns,
            "head_rows": head_rows,
            "describe_columns": describe_columns,
            "describe_rows": describe_rows,
        })