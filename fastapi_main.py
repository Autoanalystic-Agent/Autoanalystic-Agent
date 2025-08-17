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


@app.post("/chat/", response_class=HTMLResponse)
async def chat(request: Request, message: str = Form(...), filename: str = Form(None)):
    print(f"채팅 요청: message={message}, filename={filename}")

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
            shell=True
        )
        stdout, stderr = proc.communicate(timeout=600)

        if stderr:
            reply = f"❌ 오류: {stderr.decode('utf-8').strip()}"
        else:
            try:
                output_str = stdout.decode("utf-8").strip()
                print("stdout decoded:", output_str)
                response_json = json.loads(output_str)

                chat_answers = response_json.get("answers", [])
                chat_history = [{"role": "user", "content": message}]

                for answer in chat_answers:
                    content = answer.get("message", {}).get("content", "")
                    chat_history.append({"role": "bot", "content": content})

                generated_files = list_generated_files()
                preview_images = [f for f in generated_files if f["ext"] in {".png", ".jpg", ".jpeg", ".gif", ".webp"}]

                return templates.TemplateResponse("index.html", {
                    "request": request,
                    "chat_history": chat_history,
                    "current_filename": filename,
                    "generated_files": generated_files,
                    "preview_images": preview_images,
                })

            except Exception:
                reply = f"⚠️ JSON 파싱 실패:\n{stdout.decode('utf-8').strip()}"


        generated_files = list_generated_files()
        preview_images = [f for f in generated_files if f["ext"] in {".png", ".jpg", ".jpeg", ".gif", ".webp"}]

        return templates.TemplateResponse("index.html", {
            "request": request,
            "reply": reply,
            "current_filename": filename,
            "generated_files": generated_files,
            "preview_images": preview_images,
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
        })
