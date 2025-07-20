from fastapi import FastAPI, Request, UploadFile, File, Form, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
import os, subprocess, csv, json

app = FastAPI()

UPLOAD_DIR = "src/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

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


@app.get("/", response_class=HTMLResponse)
async def home(request: Request, filename: str = Query(None)):
    head_columns = []
    head_rows = []

    if filename:
        file_path = os.path.join(UPLOAD_DIR, filename)
        try:
            with open(file_path, newline="", encoding="utf-8") as csvfile:
                reader = csv.DictReader(csvfile)
                head_columns = reader.fieldnames or []
                for i, row in enumerate(reader):
                    if i >= 5:
                        break
                    head_rows.append(row)
        except Exception as e:
            print(f"CSV 읽기 오류: {e}")

    return templates.TemplateResponse("index.html", {
        "request": request,
        "head_columns": head_columns,
        "head_rows": head_rows,
        "current_filename": filename
    })


@app.post("/upload_csv/")
async def upload_csv(request: Request, file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as f:
        f.write(await file.read())
    # 업로드 후 루트 페이지로 리다이렉트 (파일명 쿼리 전달)
    print("업로드된 파일 이름:", file.filename)
    return RedirectResponse(url=f"/?filename={file.filename}", status_code=303)
    #return {"filename": file.filename}


@app.post("/chat/", response_class=HTMLResponse)
async def chat(
    request: Request,
    message: str = Form(...),
    filename: str = Form(None)
):
    print(f"채팅 요청: message={message}, filename={filename}")

    try:
        # main.ts 호출 (user message + optional filename)
        cmd = ["npx", "ts-node", "src/main.ts", message]
        if filename:
            file_path = os.path.join(UPLOAD_DIR, filename)
            cmd.append(file_path)
            print(file_path)


        proc = subprocess.Popen(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            #universal_newlines=True,
            
            shell=True
        )
        stdout, stderr = proc.communicate(timeout=30)

        if stderr:
            reply = f"❌ 오류: {stderr.strip()}"
        else:
            try:
                output_str = stdout.decode("utf-8").strip()
                # 디버깅용 출력 (원하면 제거 가능)
                print("stdout decoded:", output_str)
                response_json = json.loads(output_str)

                chat_answers = response_json.get("answers", [])

                chat_history = [
                    {"role": "user", "content": message}
                ]

                for answer in chat_answers:
                    content = answer.get("message", {}).get("content", "")
                    chat_history.append({"role": "bot", "content": content})

                return templates.TemplateResponse("index.html", {
                    "request": request,
                    "chat_history": chat_history,
                    "current_filename": filename
                })

            except Exception as e:
                reply = f"⚠️ JSON 파싱 실패:\n{stdout.strip()}"

        return templates.TemplateResponse("index.html", {
            "request": request,
            "reply": reply,
            "current_filename": filename
        })

    except subprocess.TimeoutExpired:
        return templates.TemplateResponse("index.html", {
            "request": request,
            "reply": "⚠️ 응답 시간 초과",
            "current_filename": filename
        })
