from fastapi import FastAPI, Request, UploadFile, File, Form, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
import os, subprocess, csv, json
from pathlib import Path
from typing import List, Dict

# ADD sessions
import uuid, subprocess, json, re

app = FastAPI()

UPLOAD_DIR = Path("src/uploads")
OUTPUT_DIR = Path("src/outputs")    # 생성물이 저장되는 폴더

UPLOAD_DIR.mkdir(exist_ok=True)
OUTPUT_DIR.mkdir(exist_ok=True)

# === Add: path → /outputs URL 매핑 유틸 ===
# [ADD] 단계(툴)별 상태·아티팩트 정리 유틸
import re

# ADD
# 파일 상단 import 아래에 추가
PROJECT_ROOT = Path(__file__).resolve().parent
NPX = "npx.cmd" if os.name == "nt" else "npx"

def run_ts_workflow(file_path: Path, sessionId:str, message: str = "분석해줘"):
    import shlex, subprocess, os
    # ⬇️ 여기: main.ts + --mode=workflow
    base_args = [NPX, "ts-node", "src/main.ts", "--mode=workflow", message, str(file_path), sessionId]
    env = os.environ.copy()
    try:
        proc = subprocess.Popen(
            base_args,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            shell=False,
            text=True,
            encoding="utf-8",
            errors="replace",
            cwd=str(PROJECT_ROOT),
            env=env,
        )
        stdout, stderr = proc.communicate(timeout=600)
        return proc.returncode, stdout, stderr
    except FileNotFoundError:
        cmd_str = f'{NPX} ts-node src/main.ts --mode=workflow {shlex.quote(message)} {shlex.quote(str(file_path))}'
        proc = subprocess.Popen(
            cmd_str,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            shell=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            cwd=str(PROJECT_ROOT),
            env=env,
        )
        stdout, stderr = proc.communicate(timeout=600)
        return proc.returncode, stdout, stderr


def extract_json_and_text(output_str: str):
    """
    LLM 출력에서 JSON과 자연어 설명을 분리.
    예: "설명문 ... {json...}" → ("설명문", {...})
    """
    json_part = None
    text_part = output_str
    m = re.search(r"(\{[\s\S]*\})", output_str)
    if m:
        try:
            json_part = json.loads(m.group(1))
            text_part = output_str[:m.start()] + output_str[m.end():]
        except Exception:
            pass
    return text_part.strip(), json_part


def format_tool_output(parsed_json, sessionId):
    """LLM 또는 Tool JSON을 Markdown 텍스트로 변환 (Tool별 섹션 스타일)"""
    emoji_map = {
        "BasicAnalysisTool": "🧮",
        "CorrelationTool": "📊",
        "SelectorTool": "🧩",
        "PreprocessingTool": "🧼",
        "VisualizationTool": "📈",
        "MachineLearningTool": "🤖",
        "WorkflowTool": "⚙️",
    }

    md = ""
    if "answers" in parsed_json:
        for ans in parsed_json["answers"]:
            tool = ans.get("tool", "")
            summary = ans.get("summary", "")
            args = ans.get("arguments", {})
            icon = emoji_map.get(tool, "🔹")

            md += f"### {icon} {tool}\n"
            if summary:
                md += f"- **요약:** {summary}\n\n"

            if "columnStats" in args:
                md += "| 컬럼 | 타입 | 결측치 | 고유값 |\n|------|------|--------|--------|\n"
                for c in args["columnStats"]:
                    md += f"| {c.get('column','-')} | {c.get('dtype','-')} | {c.get('missing',0)} | {c.get('unique','-')} |\n"
                md += "\n"

            if "selectedColumns" in args:
                cols = ", ".join(args["selectedColumns"]) or "—"
                md += f"**선택된 컬럼:** {cols}\n\n"

            if "recommendedPairs" in args:
                pairs = args["recommendedPairs"]
                if pairs:
                    md += "**추천 페어:**\n"
                    for p in pairs:
                        md += f"- {p['column1']} × {p['column2']}\n"
                    md += "\n"

            if "mlModelRecommendation" in args:
                rec = args["mlModelRecommendation"]
                if rec:
                    md += f"**추천 모델:** {rec.get('model','—')}  \n"
                    if rec.get("score") is not None:
                        md += f"**정확도:** {rec['score']*100:.1f}%  \n"
                    if rec.get("reason"):
                        md += f"🧠 {rec['reason']}\n\n"

            if "comment" in args or "description" in args:
                desc = args.get("comment") or args.get("description")
                md += f"🧠 **설명:** {desc}\n\n"

            md += "---\n\n"
        return md

    elif "arguments" in parsed_json:
        args = parsed_json["arguments"]
        md += "### 🧩 Tool 결과\n"
        if "columnStats" in args:
            md += "| 컬럼 | 타입 | 결측치 | 고유값 |\n|------|------|--------|--------|\n"
            for c in args["columnStats"]:
                md += f"| {c.get('column','-')} | {c.get('dtype','-')} | {c.get('missing',0)} | {c.get('unique','-')} |\n"
            md += "\n"
        if "summary" in args:
            md += f"🧠 **설명:** {args['summary']}\n\n"
        return md
    else:
        return f"```json\n{json.dumps(parsed_json, indent=2, ensure_ascii=False)}\n```"


def _norm(p: str) -> str:
    return str(p).replace("\\", "/")

def path_to_outputs_url(path: str | None,sessionId : str) -> str | None:
    if not path:
        return None
    p = Path(path)
    try:
        rel = p.relative_to(OUTPUT_DIR)
        return f"/outputs/{sessionId}/{_norm(rel)}"
    except Exception:
        return f"/outputs/{sessionId}/{_norm(p.name)}"

def map_artifacts(workflow: dict, sessionId: str) -> dict:
    if not isinstance(workflow, dict):
        return workflow
    wf = dict(workflow)

    # 1) 전처리 산출물 URL
    if wf.get("preprocessedFilePath"):
        wf["preprocessedFilePathUrl"] = path_to_outputs_url(wf["preprocessedFilePath"], sessionId)

    # 2) ML 결과 표준화
    #    mlResultPath가 올 수 있는 모든 케이스(dict/str/None/기타)를 안전 처리
    raw = wf.get("mlResultPath")
    mlp = {}

    if isinstance(raw, dict):
        mlp = raw
    elif isinstance(raw, str):
        # 문자열만 오면 보고서 경로로 간주
        mlp = {"reportPath": raw}
    elif raw is None:
        mlp = {}
    else:
        # 리스트/튜플/기타가 올 수도 있으니 방어
        try:
            mlp = dict(raw)  # (key, value) 시퀀스면 변환될 수 있음
        except Exception:
            mlp = {}

    # reportPath / mlResultPath 등 경로 키에서 URL 파생 (둘 다 지원)
    if isinstance(mlp.get("mlResultPath"), str):
        mlp["mlResultUrl"] = path_to_outputs_url(mlp["mlResultPath"], sessionId)
    if isinstance(mlp.get("reportPath"), str):
        mlp["reportUrl"] = path_to_outputs_url(mlp["reportPath"], sessionId)
        # 보고서 본문이 '�' 등 깨져있다면 UTF-8 재로드 시도
        if mlp.get("report") and "�" in mlp["report"]:
            try:
                mlp["report"] = Path(mlp["reportPath"]).read_text(encoding="utf-8", errors="ignore")
            except Exception:
                pass

    wf["mlResultPath"] = mlp  # 표준화된 형태로 되돌려 넣기

    if isinstance(wf.get("chartPaths"), list):
        wf["chartUrls"] = [path_to_outputs_url(p, sessionId) for p in wf["chartPaths"]]
    return wf

def build_steps(wf: dict, corr_has_table: bool = False) -> list[dict]:  # [CHANGED]
    """워크플로 dict에서 단계(툴)별 완료 여부를 계산"""
    def st(key, title, ok):
        return {"key": key, "title": title, "status": "done" if ok else "skipped"}

    steps = []
    steps.append(st("basic",     "1) BasicAnalysisTool",            bool(wf.get("columnStats"))))
    steps.append(st("corr",      "2) Correlation",                bool(corr_has_table)))  # [NEW]
    steps.append(st("selector",  "3) SelectorTool",                 bool(wf.get("selectedColumns") or wf.get("recommendedPairs") or wf.get("preprocessingRecommendations"))))
    steps.append(st("visual",    "4) VisualizationTool",            bool(wf.get("chartUrls"))))
    steps.append(st("preprocess","5) PreprocessExecutorTool",       bool(wf.get("preprocessedFilePathUrl"))))
    ml_ok = bool( (wf.get("mlModelRecommendation") and wf["mlModelRecommendation"].get("model")) or
                  (wf.get("mlResultPath") and (wf["mlResultPath"].get("mlResultUrl") or wf["mlResultPath"].get("reportUrl"))) )
    steps.append(st("train",     "6) MachineLearningTool",          ml_ok))
    return steps

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
def list_generated_files(sessionId:str) -> List[Dict]:
    """OUTPUT_DIR 내 생성물 파일 리스트를 dict 목록으로 반환"""
    files = []
    if not sessionId:
        # 적절한 기본값 또는 에러 처리
        sessionId = "default"  # 임시 기본 디렉토리
    session_dir = OUTPUT_DIR / sessionId
    if OUTPUT_DIR.exists():
        for p in sorted(session_dir.glob("*")):
            if p.is_file():
                files.append({
                    "name": p.name,
                    "url": f"/outputs/{sessionId}/{p.name}",
                    "size": p.stat().st_size,
                    "ext": p.suffix.lower(),
                })
    return files


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


# 생성물 폴더를 /outputs 경로로 정적 서빙
app.mount("/outputs", StaticFiles(directory=str(OUTPUT_DIR)), name="outputs")

# ------------------------------
# 세션 관리
# ------------------------------
session_files: Dict[str, str] = {}
chat_histories: Dict[str, List[Dict]] = {}

# ------------------------------
# 홈
# ------------------------------
@app.get("/", response_class=HTMLResponse)
async def home(request: Request, sessionId: str = Query(None)):
    # ADD
    file_path = session_files.get(sessionId)
    chat_history = chat_histories.get(sessionId, [])
    
    head_columns = []
    head_rows = []
    describe_columns = []
    describe_rows = []

    # if filename:
    #     file_path = UPLOAD_DIR / filename
    #     try:
    #         with file_path.open(newline="", encoding="utf-8") as csvfile:
    #             reader = csv.DictReader(csvfile)
    #             head_columns = reader.fieldnames or []
    #             for i, row in enumerate(reader):
    #                 if i >= 5:
    #                     break
    #                 head_rows.append(row)
    #     except Exception as e:
    #         print(f"CSV 읽기 오류: {e}")
    # if filename:
    #     file_path = UPLOAD_DIR / filename
    #     if file_path.exists():
    #         # ✅ pandas 기반 미리보기 + 기술통계
    #         head_columns, head_rows, describe_columns, describe_rows = get_csv_preview(str(file_path))
    if file_path:
        head_columns, head_rows, describe_columns, describe_rows = get_csv_preview(file_path)

    generated_files = list_generated_files(sessionId)

    # 이미지 미리보기용 생성물 (확장자 기준)
    preview_images = [f for f in generated_files if f["ext"] in {".png", ".jpg", ".jpeg", ".gif", ".webp"}]

    return templates.TemplateResponse("index.html", {
        "request": request,
        "head_columns": head_columns,
        "head_rows": head_rows,
        "describe_columns": describe_columns,
        "describe_rows": describe_rows,
        "current_filename": Path(file_path).name if file_path else None,
        "current_session": sessionId,
        "generated_files": generated_files,
        "preview_images": preview_images,
        "corr": {"headers": [], "rows": []},  # [NEW]
    })


# ------------------------------
# CSV 업로드
# ------------------------------
@app.post("/upload_csv/")
async def upload_csv(request: Request, file: UploadFile = File(...)):
    sessionId = str(uuid.uuid4())
    session_dir = UPLOAD_DIR / sessionId
    session_dir.mkdir(exist_ok=True, parents=True)

    file_path = session_dir / file.filename

    with file_path.open("wb") as f:
        f.write(await file.read())

    # sessionId 기준으로 저장
    session_files[sessionId] = str(file_path)
    chat_histories[sessionId] = []

    head_columns, head_rows, describe_columns, describe_rows = get_csv_preview(str(file_path))

    return templates.TemplateResponse("index.html", {
        "request": request,
        "current_filename": file.filename,
        "current_session": sessionId,
        "chat_history": chat_histories[sessionId],
        "workflow": None,
        "steps": [],
        "generated_files": list_generated_files(sessionId),
        "preview_images": [],
        "head_columns": head_columns,
        "head_rows": head_rows,
        "describe_columns": describe_columns,
        "describe_rows": describe_rows,
        "corr": {"headers": [], "rows": []},  # [NEW]
    })

# [NEW] 업로드 폴더 내 Correlation CSV 경로 추정 + 로딩 ------------------------
def _load_corr_csv(csv_path: str | None) -> dict:  # [NEW]
    if not csv_path:
        return {"headers": [], "rows": []}
    try:
        with open(csv_path, newline="", encoding="utf-8") as f:
            reader = csv.reader(f)
            rows = list(reader)
        if not rows:
            return {"headers": [], "rows": []}
        headers = rows[0][1:]
        body = [{"row": r[0], "vals": r[1:]} for r in rows[1:]]
        return {"headers": headers, "rows": body}
    except Exception as e:
        print(f"[CORR] read error: {e}")
        return {"headers": [], "rows": []}
# ---------------------------------------------------------------------------


# [ADD] 업로드된 파일로 워크플로우를 한 번에 실행하는 엔드포인트
@app.post("/run_workflow/", response_class=HTMLResponse)
async def run_workflow(request: Request, sessionId: str = Form(None), filename: str = Form(None)):
    # 파일이 없으면 안내만 보여줌
    if sessionId not in session_files:
        generated_files = list_generated_files(sessionId)
        preview_images = [f for f in generated_files if f["ext"] in {".png", ".jpg", ".jpeg", ".gif", ".webp"}]
        return templates.TemplateResponse("index.html", {
            "request": request, "reply": "⚠️ 먼저 CSV를 업로드하세요.","current_session": None,
            "current_filename": None, "generated_files": generated_files, "preview_images": preview_images,
            "workflow": None, "steps": [], "head_columns": [], "head_rows": [],
            "describe_columns": [], "describe_rows": [],
            "corr": {"headers": [], "rows": []},
        })
    file_path = Path(session_files[sessionId])
    filename = file_path.name
    print(file_path, filename)

    if not file_path.exists():
        generated_files  = list_generated_files(sessionId)
        preview_images = [f for f in generated_files if f["ext"] in {".png",".jpg",".jpeg",".gif",".webp"}]
        return templates.TemplateResponse("index.html", {
            "request": request, "reply": "⚠️ 업로드된 파일을 찾지 못했습니다.", "current_session": sessionId,
            "current_filename": filename, "generated_files": generated_files, "preview_images": preview_images,
            "workflow": None, "steps": [], "head_columns": [], "head_rows": [],
            "describe_columns": [], "describe_rows": [],
            "corr": {"headers": [], "rows": []},
        })

    # 워크플로우 실행
    try:
        code, stdout, stderr = run_ts_workflow(file_path, sessionId, message="분석해줘")
        print(file_path, sessionId, filename)
        if code != 0:
            reply = f"❌ 오류: {stderr.strip() or 'unknown error'}"
            generated_files  = list_generated_files(sessionId)
            preview_images  = [f for f in generated_files if f["ext"] in {".png",".jpg",".jpeg",".gif",".webp"}]
            hc, hr, dc, dr = get_csv_preview(str(file_path))
            return templates.TemplateResponse("index.html", {
                "request": request, "reply": reply, "current_filename": filename, "current_session": sessionId,
                "generated_files": generated_files, "preview_images": preview_images, "workflow": None, "steps": [],
                "head_columns": hc, "head_rows": hr, "describe_columns": dc, "describe_rows": dr,
                "corr": {"headers": [], "rows": []},
            })

        # JSON 파싱 → 카드 데이터 구성
        output_str = (stdout or "").strip()
        print("output_str", output_str)
        wf_raw, _ = extract_workflow_dict(output_str)

        # (선택) 파싱 실패 시 최근 생성 이미지로 최소 Visualization 카드라도 띄우기
        if not isinstance(wf_raw, dict):
            now = time.time()
            recent = []
            for p in OUTPUT_DIR.glob("*"):
                if p.is_file() and p.suffix.lower() in {".png",".jpg",".jpeg",".gif",".webp"}:
                    if now - p.stat().st_mtime <= 15:
                        recent.append(f"/outputs/{sessionId}/{p.name}")
            if recent:
                wf_raw = {"chartPaths": recent}

        # 매핑/스텝 구성

        workflow_mapped = map_artifacts(wf_raw, sessionId) if isinstance(wf_raw, dict) else None

        # [NEW] Correlation CSV 로드 → 템플릿 전달 + steps 반영
        corr_csv_path = None
        root = OUTPUT_DIR / sessionId                      # ← src/outputs/<sessionId>
        if root.exists():
            # 1) 파일명과 딱 맞는 것 우선
            exact = root / f"{Path(filename).stem}.corr_matrix.csv"
            if exact.exists():
                corr_csv_path = str(exact)
            else:
                # 2) 없으면 폴더 전체에서 패턴 검색
                for q in root.rglob("*corr_matrix.csv"):
                    corr_csv_path = str(q)
                    break
        corr = _load_corr_csv(corr_csv_path)                  # [NEW]
        corr_has_table = bool(corr.get("headers"))            # [NEW]


        steps = build_steps(workflow_mapped, corr_has_table) if workflow_mapped else []  # [CHANGED]

        # 파일/미리보기/기술통계
        generated_files = list_generated_files(sessionId)
        preview_images = [f for f in generated_files if f["ext"] in {".png",".jpg",".jpeg",".gif",".webp"}]
        hc, hr, dc, dr = get_csv_preview(str(file_path))

        # 폴백: 파싱 실패했지만 이미지가 있다면 최소 Visualization 카드라도 표시
        if not workflow_mapped and preview_images:
            workflow_mapped = {"chartUrls": [img["url"] for img in preview_images]}
            steps = build_steps(workflow_mapped, corr_has_table)  # [CHANGED]


        print("[WF] keys:", list((workflow_mapped or {}).keys()))


        return templates.TemplateResponse("index.html", {
            "request": request, "current_filename": filename, "current_session":sessionId,
            "generated_files": generated_files, "preview_images": preview_images,
            "workflow": workflow_mapped, "steps": steps,
            "head_columns": hc, "head_rows": hr, "describe_columns": dc, "describe_rows": dr, "corr": corr,
        })

    except subprocess.TimeoutExpired:
        gf = list_generated_files(sessionId)
        pv = [f for f in gf if f["ext"] in {".png",".jpg",".jpeg",".gif",".webp"}]
        hc, hr, dc, dr = get_csv_preview(str(file_path))
        return templates.TemplateResponse("index.html", {
            "request": request, "reply": "⚠️ 응답 시간 초과", "current_filename": filename,
            "generated_files": gf, "preview_images": pv,
            "workflow": None, "steps": [], "head_columns": hc, "head_rows": hr,
            "describe_columns": dc, "describe_rows": dr,
            "corr": {"headers": [], "rows": []},
        })
# ------------------------------
# 채팅
# ------------------------------
@app.post("/chat/", response_class=HTMLResponse)
async def chat(request: Request, message: str = Form(...), sessionId: str = Form(None), filename: str = Form(None)):
    if sessionId not in session_files:
        reply = "⚠️ 파일이 유효하지 않습니다. CSV를 먼저 업로드해주세요."
        return templates.TemplateResponse("index.html", {"request": request, "reply": reply})

    file_path = Path(session_files[sessionId])
    filename = file_path.name
    chat_history = chat_histories.get(sessionId, [])
    chat_history.append({"role": "user", "content": message})

    try:
        cmd = [NPX, "ts-node", "src/main.ts", "--mode=chat", message, str(file_path), sessionId]
        proc = subprocess.Popen(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            shell=False,
            text=True,
            encoding="utf-8",
            errors="replace",
            cwd=str(PROJECT_ROOT),
        )
        stdout, stderr = proc.communicate(timeout=600)
        output_str = sanitize_stdout(stdout)

        # ✅ 텍스트 + JSON 분리
        text_part, parsed_json = extract_json_and_text(output_str)

        # ✅ Markdown 생성
        md_output = ""
        if text_part:
            md_output += text_part + "\n\n"
        if parsed_json:
            md_output += format_tool_output(parsed_json, sessionId)

        # ✅ 이미지/파일 링크 추가
        generated_files = list_generated_files(sessionId)
        preview_images = [f for f in generated_files if f["ext"] in {".png", ".jpg", ".jpeg", ".gif", ".webp"}]
        other_files = [f for f in generated_files if f["ext"] in {".csv", ".json", ".txt", ".html", ".md"}]
        if preview_images or other_files:
            md_output += "\n\n### 📂 시각화/결과 파일\n"
            for img in preview_images:
                rel = f"/outputs/{sessionId}/{img['name']}"
                md_output += f'<a href="{rel}" target="_blank"><img src="{rel}" alt="{img["name"]}" style="max-width:100%;height:auto;border-radius:8px;"/></a>\n'
            for f in other_files:
                rel = f"/outputs/{sessionId}/{f['name']}"
                md_output += f"- [{f['name']}]({rel})\n"

        chat_history.append({"role": "bot", "content": md_output})
        chat_histories[sessionId] = chat_history

        head_columns, head_rows, describe_columns, describe_rows = get_csv_preview(file_path)
        return templates.TemplateResponse("index.html", {
            "request": request,
            "chat_history": chat_history,
            "current_filename": filename,
            "current_session": sessionId,
            "head_columns": head_columns,
            "head_rows": head_rows,
            "describe_columns": describe_columns,
            "describe_rows": describe_rows,
            "generated_files": generated_files,
            "preview_images": preview_images,
            "corr": {"headers": [], "rows": []},
        })

    except subprocess.TimeoutExpired:
        reply = "⚠️ 응답 시간 초과"
        chat_history.append({"role": "bot", "content": reply})
        chat_histories[sessionId] = chat_history
        return templates.TemplateResponse("index.html", {
            "request": request,
            "chat_history": chat_history,
            "reply": reply,
            "current_filename": filename,
        })
