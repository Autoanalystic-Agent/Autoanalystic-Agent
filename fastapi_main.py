from fastapi import FastAPI, Request, UploadFile, File, Form, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, RedirectResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from pathlib import Path
import pandas as pd
import io
import os, subprocess, csv, json, sys

app = FastAPI()

BASE = Path(__file__).parent
UPLOAD_DIR = BASE / "src" / "uploads"
OUTPUT_DIR = BASE / "src" / "outputs"       # ⬅ 생성물 저장 폴더 (우측 패널용)
STATIC_OUTPUT_DIR = BASE / "src" / "outputs"  # ⬅ (기존 이미지가 여기 쌓인다면 유지)

UPLOAD_DIR.mkdir(exist_ok=True)
OUTPUT_DIR.mkdir(exist_ok=True)

templates = Jinja2Templates(directory=str(BASE / "templates"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"],
)

# 정적 서빙
# 1) 기존: src/outputs 를 /static 으로 노출 (이미지 미리보기)
app.mount("/static", StaticFiles(directory=str(STATIC_OUTPUT_DIR)), name="static")
# 2) 생성물: outputs 를 /outputs 으로 노출 (다운로드/미리보기)
app.mount("/outputs", StaticFiles(directory=str(OUTPUT_DIR)), name="outputs")


def list_generated_files() -> list[dict]:
    """우측 패널에 뿌릴 파일 목록(OUTPUT_DIR 기준)."""
    files = []
    if OUTPUT_DIR.exists():
        for p in sorted(OUTPUT_DIR.glob("*")):
            if p.is_file():
                files.append({
                    "name": p.name,
                    "url": f"/outputs/{p.name}",     # 미리보기/다운로드 경로
                    "size": p.stat().st_size,
                })
    return files

def safe_describe(df: pd.DataFrame) -> pd.DataFrame:
    # 1) 최신 버전이면 그대로
    try:
        return df.describe(include="all", datetime_is_numeric=True).round(3)
    except TypeError:
        pass

    # 2) 구버전 폴백: datetime 컬럼을 숫자로 변환 후 describe()
    df2 = df.copy()
    dt_cols = df2.select_dtypes(include=['datetime', 'datetimetz']).columns

    for c in dt_cols:
        s = pd.to_datetime(df2[c], errors="coerce")
        # datetime64[ns] → epoch ns 정수
        try:
            df2[c] = s.view("int64")
        except Exception:
            df2[c] = s.astype("int64")  # 일부 버전 대비

    return df2.describe(include="all").round(3)



@app.get("/", response_class=HTMLResponse)
async def home(request: Request, filename: str = Query(None)):
    head_columns, head_rows = [], []
    tail_columns, tail_rows = [], []
    describe_columns, describe_rows = [], []
    df_info_text = ""

    if filename:
        file_path = UPLOAD_DIR / filename
        try:
            # 필요 시 sep=',' 조정, 메모리 크면 usecols/nrows 옵션 고려
            df = pd.read_csv(file_path, encoding="utf-8-sig")

            # head(5)
            head_df = df.head(5)
            head_columns = list(head_df.columns)
            head_rows = head_df.to_dict(orient="records")

            # tail(5)
            tail_df = df.tail(5)
            tail_columns = list(tail_df.columns)
            tail_rows = tail_df.to_dict(orient="records")

            # describe()
            desc = safe_describe(df)
            describe_columns = ["stat"] + list(desc.columns)
            describe_rows = [{"stat": idx, **row.to_dict()} for idx, row in desc.iterrows()]


            # info()
            buf = io.StringIO()
            df.info(buf=buf)
            df_info_text = buf.getvalue()

        except Exception as e:
            print(f"CSV 처리 오류: {e}")

    return templates.TemplateResponse("index.html", {
        "request": request,
        "current_filename": filename,
        # head
        "head_columns": head_columns,
        "head_rows": head_rows,
        # tail
        "tail_columns": tail_columns,
        "tail_rows": tail_rows,
        # describe
        "describe_columns": describe_columns,
        "describe_rows": describe_rows,
        # info
        "df_info_text": df_info_text,
        # 우측 패널
        "generated_files": list_generated_files(),
    })


@app.post("/upload_csv/")
async def upload_csv(request: Request, file: UploadFile = File(...)):
    dest = UPLOAD_DIR / file.filename
    with dest.open("wb") as f:
        f.write(await file.read())
    print("업로드된 파일 이름:", file.filename)
    # 업로드 후 루트로 리다이렉트
    return RedirectResponse(url=f"/?filename={file.filename}", status_code=303)


@app.post("/chat/", response_class=HTMLResponse)
async def chat(request: Request, message: str = Form(...), filename: str = Form(None)):
    print(f"채팅 요청: message={message}, filename={filename}")

    # ----- subprocess 호출 정리 -----
    # Windows에서 안전하게: shell=False + list, text=True 로 자동 디코딩
    cmd = ["npx", "ts-node", "src/main.ts", message]
    if filename:
        cmd.append(str(UPLOAD_DIR / filename))
        print(UPLOAD_DIR / filename)

    try:
        proc = subprocess.run(
            cmd,
            capture_output=True,
            text=True,        # stdout/stderr를 str로 받음
            timeout=60,       # 필요시 조정
            cwd=str(BASE),    # 작업 디렉토리 명확히
            shell=True,      # 보안/호환성 측면에서 권장
        )
    except subprocess.TimeoutExpired:
        return templates.TemplateResponse("index.html", {
            "request": request,
            "reply": "⚠️ 응답 시간 초과",
            "current_filename": filename,
            "generated_files": list_generated_files(),
        })

    if proc.returncode != 0:
        reply = f"❌ 오류: {proc.stderr.strip() or '프로세스 실패'}"
        return templates.TemplateResponse("index.html", {
            "request": request,
            "reply": reply,
            "current_filename": filename,
            "generated_files": list_generated_files(),
        })

    # ----- JSON 파싱 -----
    try:
        output_str = proc.stdout.strip()
        print("stdout decoded:", output_str)
        response_json = json.loads(output_str)
    except Exception:
        return templates.TemplateResponse("index.html", {
            "request": request,
            "reply": f"⚠️ JSON 파싱 실패:\n{proc.stdout.strip()}",
            "current_filename": filename,
            "generated_files": list_generated_files(),
        })

    chat_answers = response_json.get("answers", [])
    chat_history = [{"role": "user", "content": message}]
    for answer in chat_answers:
        content = (answer.get("message") or {}).get("content", "")
        if content:
            chat_history.append({"role": "bot", "content": content})

    # 중앙(채팅 아래) 이미지 미리보기: 기존 src/outputs 사용 유지
    image_files = []
    if STATIC_OUTPUT_DIR.exists():
        image_files = [f.name for f in STATIC_OUTPUT_DIR.iterdir()
                       if f.is_file() and f.suffix.lower() in {".png", ".jpg", ".jpeg", ".webp", ".gif"}]

    return templates.TemplateResponse("index.html", {
        "request": request,
        "chat_history": chat_history,
        "current_filename": filename,
        "image_files": image_files,              # 중앙 섹션
        "generated_files": list_generated_files() # 우측 패널
    })
