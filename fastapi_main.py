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

import re, time, json
ANSI_RE = re.compile(r"\x1b\[[0-9;]*m")

def sanitize_stdout(s: str) -> str:
    if not s: return ""
    return ANSI_RE.sub("", s).strip()

def _looks_like_workflow(obj: dict) -> bool:
    """워크플로 핵심 키가 1개라도 있어야 유효로 간주"""
    if not isinstance(obj, dict):
        return False
    keys = {
        "columnStats", "selectedColumns", "recommendedPairs",
        "preprocessingRecommendations", "preprocessedFilePath",
        "preprocessedFilePathUrl", "mlModelRecommendation",
        "mlResultPath", "chartPaths", "chartUrls"
    }
    return any(k in obj for k in keys)

def _jsonify_js_like(text: str) -> str:
    """JS풍 객체/배열 문자열을 JSON으로 근사 변환"""
    s = text
    # 키에 쌍따옴표 없으면 추가: { key: ... } => { "key": ... }
    s = re.sub(r'([{\[,]\s*)([A-Za-z_][A-Za-z0-9_]*)\s*:', r'\1"\2":', s)
    # ' -> "
    s = s.replace("'", '"')
    # NaN/Infinity 계열
    s = re.sub(r'\bNaN\b', 'null', s)
    s = re.sub(r'\b-Infinity\b', 'null', s)
    s = re.sub(r'\bInfinity\b', 'null', s)
    # 끝 콤마 제거
    s = re.sub(r',\s*([}\]])', r'\1', s)
    return s

def extract_workflow_dict(output_str: str):
    """
    1) coerce_to_json
    2) ```json ... ``` 코드블록
    3) 최상위 JSON의 answers[*].message.content 내부 JSON
    4) 로그 텍스트의 'BasicAnalysisTool 결과: [ ... ]' 패턴 재구성 → {'columnStats': [...]}
    실패 시 (None, None)
    """
    s = sanitize_stdout(output_str)

    m = re.search(r"<<<WORKFLOW_JSON_START>>>\s*([\s\S]*?)\s*<<<WORKFLOW_JSON_END>>>", s)
    if m:
        try:
            obj = json.loads(m.group(1))
            cand = obj.get("workflow") if isinstance(obj, dict) else None
            if isinstance(cand, dict):
                return cand, obj
        except Exception:
            pass


    # 1) 1차: 기존 보정 파서
    top = coerce_to_json(s)
    if isinstance(top, dict):
        for cand in (top.get("workflow"), top.get("result"), top):
            if isinstance(cand, dict) and _looks_like_workflow(cand):
                return cand, top

    # 2) ```json ... ``` 코드블록
    for m in re.finditer(r"```(?:json)?\s*([\s\S]*?)```", s, re.I):
        block = m.group(1).strip()
        try:
            obj = json.loads(block)
            for cand in (obj.get("workflow"), obj.get("result"), obj):
                if isinstance(cand, dict) and _looks_like_workflow(cand):
                    return cand, obj
        except Exception:
            pass

    # 3) answers[*].message.content 내부 JSON
    try:
        maybe = json.loads(s)
        if isinstance(maybe, dict):
            for a in (maybe.get("answers") or []):
                content = ((a.get("message") or {}).get("content") or "").strip()
                if not content:
                    continue
                try:
                    obj = json.loads(content)
                except Exception:
                    obj = coerce_to_json(content.replace('\\"','"'))
                if isinstance(obj, dict):
                    for cand in (obj.get("workflow"), obj.get("result"), obj):
                        if isinstance(cand, dict) and _looks_like_workflow(cand):
                            return cand, obj
    except Exception:
        pass

    # 4) 로그 텍스트에서 BasicAnalysisTool 배열만이라도 추출
    m = re.search(r"BasicAnalysisTool\s*결과\s*:\s*(\[[\s\S]*?\])", s, re.I)
    if m:
        arr_text = _jsonify_js_like(m.group(1))
        try:
            arr = json.loads(arr_text)
            if isinstance(arr, list) and arr and isinstance(arr[0], dict):
                wf = {"columnStats": arr}
                return wf, {"columnStats": arr}
        except Exception:
            pass

    return None, None


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


# [ADD] 업로드된 파일로 워크플로우를 한 번에 실행하는 엔드포인트
@app.post("/run_workflow/", response_class=HTMLResponse)
async def run_workflow(request: Request, filename: str = Form(None)):
    # 파일이 없으면 안내만 보여줌
    if not filename:
        generated_files = list_generated_files()
        preview_images = [f for f in generated_files if f["ext"] in {".png", ".jpg", ".jpeg", ".gif", ".webp"}]
        return templates.TemplateResponse("index.html", {
            "request": request, "reply": "⚠️ 먼저 CSV를 업로드하세요.",
            "current_filename": None, "generated_files": generated_files, "preview_images": preview_images,
            "workflow": None, "steps": [], "head_columns": [], "head_rows": [],
            "describe_columns": [], "describe_rows": [],
        })
    file_path = UPLOAD_DIR / filename
    if not file_path.exists():
        generated_files  = list_generated_files()
        preview_images = [f for f in gf if f["ext"] in {".png",".jpg",".jpeg",".gif",".webp"}]
        return templates.TemplateResponse("index.html", {
            "request": request, "reply": "⚠️ 업로드된 파일을 찾지 못했습니다.",
            "current_filename": filename, "generated_files": generated_files, "preview_images": preview_images,
            "workflow": None, "steps": [], "head_columns": [], "head_rows": [],
            "describe_columns": [], "describe_rows": [],
        })

    # 워크플로우 실행
    try:
        code, stdout, stderr = run_ts_workflow(file_path, filename, message="분석해줘")
        if code != 0:
            reply = f"❌ 오류: {stderr.strip() or 'unknown error'}"
            generated_files  = list_generated_files()
            preview_images  = [f for f in gf if f["ext"] in {".png",".jpg",".jpeg",".gif",".webp"}]
            hc, hr, dc, dr = get_csv_preview(str(file_path))
            return templates.TemplateResponse("index.html", {
                "request": request, "reply": reply, "current_filename": filename,
                "generated_files": generated_files, "preview_images": preview_images, "workflow": None, "steps": [],
                "head_columns": hc, "head_rows": hr, "describe_columns": dc, "describe_rows": dr,
            })

        # JSON 파싱 → 카드 데이터 구성
        output_str = (stdout or "").strip()
        wf_raw, _ = extract_workflow_dict(output_str)

        # (선택) 파싱 실패 시 최근 생성 이미지로 최소 Visualization 카드라도 띄우기
        if not isinstance(wf_raw, dict):
            now = time.time()
            recent = []
            for p in OUTPUT_DIR.glob("*"):
                if p.is_file() and p.suffix.lower() in {".png",".jpg",".jpeg",".gif",".webp"}:
                    if now - p.stat().st_mtime <= 15:
                        recent.append(f"/outputs/{p.name}")
            if recent:
                wf_raw = {"chartPaths": recent}

        # 매핑/스텝 구성
        workflow_mapped = map_artifacts(wf_raw) if isinstance(wf_raw, dict) else None
        steps = build_steps(workflow_mapped) if workflow_mapped else []

        # 파일/미리보기/기술통계
        generated_files = list_generated_files()
        preview_images = [f for f in generated_files if f["ext"] in {".png",".jpg",".jpeg",".gif",".webp"}]
        hc, hr, dc, dr = get_csv_preview(str(file_path))

        # 폴백: 파싱 실패했지만 이미지가 있다면 최소 Visualization 카드라도 표시
        if not workflow_mapped and preview_images:
            workflow_mapped = {"chartUrls": [img["url"] for img in preview_images]}
            steps = build_steps(workflow_mapped)

        print("[WF] keys:", list((workflow_mapped or {}).keys()))


        return templates.TemplateResponse("index.html", {
            "request": request, "current_filename": filename,
            "generated_files": generated_files, "preview_images": preview_images,
            "workflow": workflow_mapped, "steps": steps,
            "head_columns": hc, "head_rows": hr, "describe_columns": dc, "describe_rows": dr,
        })

    except subprocess.TimeoutExpired:
        gf = list_generated_files()
        pv = [f for f in gf if f["ext"] in {".png",".jpg",".jpeg",".gif",".webp"}]
        hc, hr, dc, dr = get_csv_preview(str(file_path))
        return templates.TemplateResponse("index.html", {
            "request": request, "reply": "⚠️ 응답 시간 초과", "current_filename": filename,
            "generated_files": gf, "preview_images": pv,
            "workflow": None, "steps": [], "head_columns": hc, "head_rows": hr,
            "describe_columns": dc, "describe_rows": dr,
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

    #     if proc.returncode != 0:
    #         reply = f"❌ 오류: {stderr.strip()}"
    #     else:
    #         try:
    #             output_str = (stdout or "").strip() 
    #             print("stdout decoded:", output_str)
    #             response_json = coerce_to_json(output_str)   # [MOD]
    #             if not response_json:
    #                 raise ValueError("json parse failed")

    #             chat_answers = response_json.get("answers", [])
    #             chat_history = [{"role": "user", "content": message}]
                
    #             for answer in chat_answers:
    #                 content = (answer.get("message") or {}).get("content", "")
    #                 if content and not looks_like_dump(content):
    #                     chat_history.append({"role": "bot", "content": content})
    #                 elif content:
    #                     chat_history.append({"role": "bot", "content": "👉 아래 단계별 카드에서 분석 결과를 확인하세요."})

    #             generated_files = list_generated_files()
    #             preview_images = [f for f in generated_files if f["ext"] in {".png", ".jpg", ".jpeg", ".gif", ".webp"}]

                
    #             # ========= [ADD] 워크플로 추출 및 산출물 URL 매핑 =========
    #             workflow = None
    #             candidates = [
    #                 response_json.get("workflow"),
    #                 response_json.get("result"),
    #                 response_json,  # 최상위가 곧 워크플로일 수도 있음
    #             ]
    #             for cand in candidates:
    #                 if isinstance(cand, dict) and (
    #                     "columnStats" in cand or "mlModelRecommendation" in cand
    #                 ):
    #                     workflow = cand
    #                     break

    #             workflow_mapped = map_artifacts(workflow) if workflow else None
    #             # ========= [ADD] 끝 =========
                
    #             steps = build_steps(workflow_mapped) if workflow_mapped else []  # [ADD]
    #             if filename:
    #                 file_path = UPLOAD_DIR / filename
    #                 head_columns, head_rows, describe_columns, describe_rows = get_csv_preview(str(file_path))
    #             else:
    #                 head_columns, head_rows, describe_columns, describe_rows = [], [], [], []

    #             return templates.TemplateResponse("index.html", {
    #                 "request": request,
    #                 "chat_history": chat_history,
    #                 "current_filename": filename,
    #                 "generated_files": generated_files,
    #                 "preview_images": preview_images,
    #                 # ========= [ADD] 템플릿에 워크플로 전달 =========
    #                 "workflow": workflow_mapped,
    #                 "steps": steps,
    #                 "head_columns": head_columns,
    #                 "head_rows": head_rows,
    #                 "describe_columns": describe_columns,
    #                 "describe_rows": describe_rows,
    #                 # ============================================
    #             })

    #         except Exception:
    #             reply = f"⚠️ JSON 파싱 실패:\n{(stdout or'').strip()}"


    #     generated_files = list_generated_files()
    #     preview_images = [f for f in generated_files if f["ext"] in {".png", ".jpg", ".jpeg", ".gif", ".webp"}]
    #     if filename:
    #         file_path = UPLOAD_DIR / filename
    #         head_columns, head_rows, describe_columns, describe_rows = get_csv_preview(str(file_path))
    #     else:
    #         head_columns, head_rows, describe_columns, describe_rows = [], [], [], []


    #     return templates.TemplateResponse("index.html", {
    #         "request": request,
    #         "reply": reply,
    #         "current_filename": filename,
    #         "generated_files": generated_files,
    #         "preview_images": preview_images,
    #         # ========= [ADD] 에러 시에도 키 존재하도록 =========
    #         "workflow": None,
    #         "steps": [],
    #         "head_columns": head_columns,
    #         "head_rows": head_rows,
    #         "describe_columns": describe_columns,
    #         "describe_rows": describe_rows,
    #         # ==============================================
    #     })

    # except subprocess.TimeoutExpired:
    #     generated_files = list_generated_files()
    #     preview_images = [f for f in generated_files if f["ext"] in {".png", ".jpg", ".jpeg", ".gif", ".webp"}]

    #     return templates.TemplateResponse("index.html", {
    #         "request": request,
    #         "reply": "⚠️ 응답 시간 초과",
    #         "current_filename": filename,
    #         "generated_files": generated_files,
    #         "preview_images": preview_images,
    #         # ========= [ADD] 에러 시에도 키 존재하도록 =========
    #         "workflow": None,
    #         "steps": [],
    #         # ==============================================
    #     })