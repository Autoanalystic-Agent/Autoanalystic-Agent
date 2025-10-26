# AI 에이전트 기반 데이터 분석 툴

데이터 분석의 전 과정을 자동으로 수행하는 **AI 에이전트 기반 데이터 분석 툴**입니다. 
**Agentica**의 **Function Calling** 기능을 활용하여 다양한 라이브러리를 호출하고, 자연어 명령만으로 데이터를 분석하며 결과를 직관적으로 시각화할 수 있습니다.

**LLM 기반 에이전트 구조**를 통해 사용자의 의도를 이해하고
적절한 분석 도구를 자동 조합·실행하여, 비전문가도 손쉽게 데이터 인사이트를 도출할 수 있습니다.

- Repo: [github.com/Autoanalystic-Agent/Autoanalystic-Agent](https://github.com/Autoanalystic-Agent/Autoanalystic-Agent)
- Demo: [youtu.be/AFvnkW1hJkA](https://youtu.be/AFvnkW1hJkA)

본 프로젝트는 “CSV 데이터 분석 파이프라인 자동화 에이전트”를 목표로 하며, 비전문가도 쉽게 분석을 수행하도록 설계되었습니다.


## 구성 파일

| 경로/파일 | 설명 |
|---|---|
| `fastapi_main.py` | FastAPI 백엔드. 업로드/미리보기 템플릿 렌더링, 정적 산출물 서빙, `/chat`, `/run_workflow` 라우팅. |
| `templates/index.html` | 업로드/미리보기/실행 UI (Jinja2). |
| `src/main.ts` | Agentica 오케스트레이터 엔트리. 모드 선택(워크플로/채팅) 및 툴 실행 파이프라인. |
| `src/tools/` | 데이터 분석을 위한 에이전트 **도구 모음** 디렉터리 |
| `src/scripts/` | 파이썬 **실행 스크립트** 디렉터리. Node(Agentica)에서 `child_process`로 호출하여 시각화/학습 등을 수행합니다. |
| `src/uploads/` | 업로드된 CSV 저장 경로. |
| `src/outputs/` | **세션 단위 산출물 표준 경로**: 차트/전처리 CSV/모델/리포트. |


## 사용 기술

| 카테고리 | 기술 | 비고 |
|---|---|---|
| 언어/런타임 | **Python 3.10~3.12**, **TypeScript**, Node.js 20+ | 파이프라인: Py ↔ TS 병행 |
| 백엔드(API) | **FastAPI**, **Uvicorn** | REST 라우팅, 템플릿/정적 서빙 |
| 에이전트/오케스트레이션 | **Agentica** (TS), **child_process** , **ts-node** | TS 에이전트가 파이썬 스크립트 실행 |
| 데이터/수치 | **Pandas**, **NumPy**, **SciPy** | EDA/전처리/통계 |
| 시각화 | **Matplotlib**, **Seaborn** | 박스플롯/산점도/기타 차트 |
| ML | **scikit-learn**, **XGBoost** | 학습/평가(회귀·분류) |
| 구성/환경 | **dotenv**, requirements.txt, package.json | 설정·의존성 관리 |
| 개발도구 | **VS Code**, pip / npm, Git | 로컬 개발 표준 도구 |



## 에이전트 구조 및 시스템 구성요소 설명

**아키텍처 개요:**  
LLM이 사용자 의도를 해석하여 Basic, Preprocess, Visualization, Machine Learning 등  
여러 툴을 자동으로 조합·실행하는 **에이전트 라우팅 구조**입니다.  
필요 시 **Direct Execute(원클릭)** 기능을 통해 전체 파이프라인을 일괄 수행할 수 있습니다.

**주요 시스템 구성요:**
1. **BasicAnalysisTool** – 기초 통계 분석  
2. **CorrelationTool** – 상관관계 계산  
3. **SelectorTool** – 핵심 컬럼 추천, 전처리·시각화·ML 권장  
4. **VisualizationTool** – Boxplot, Scatter 등 차트 생성  
5. **PreprocessingTool** – 결측치 처리, 인코딩, 스케일링  
6. **MachineLearningTool** – 모델 학습 및 평가  
7. **WorkflowTool** – 전체 파이프라인 자동 실행 (E2E)

**세션 컨텍스트:**  
세션 키별 in-memory history를 유지하여  
사용자의 연속 대화 흐름과 문맥 일관성을 보장합니다.

**산출물 표준화:**  
업로드 → 기초 분석 → 전처리 → 시각화 → 모델 학습 순의 결과물을  
`src/outputs/{sessionId}/` 하위에 자동 저장합니다.


## 적용 예시 (간단 실행):
```

0) 요구 사항

Python 3.13+ (권장)

Node.js 20+ / npm 10.5+

Git

(선택) VS Code

1) 프로젝트 받기
git clone <https://github.com/Autoanalystic-Agent/Autoanalystic-Agent.git>
cd <https://github.com/Autoanalystic-Agent/Autoanalystic-Agent.git>

2) 파이썬 가상환경 (권장)

Windows (PowerShell)

py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip


macOS / Linux

python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip


가상환경은 권장이며, .env 생성 여부와는 무관합니다.

3) 의존성 설치
# Python
pip install -r requirements.txt

# Node
npm install

4) 환경변수 파일(.env) 생성

레포에는 보통 .env가 포함되지 않습니다. 프로젝트 루트에 직접 생성하세요.

./.env

# 필수
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx

# 필요시 추가
# PORT=8000
# LOG_LEVEL=info
# DATABASE_URL=...


5) 서버 실행
uvicorn app.main:app --reload
# 필요시
# uvicorn app.main:app --reload --host 0.0.0.0 --port 8000


VS Code 사용 시: Ctrl/Cmd + Shift + P → Python: Select Interpreter → .venv 선택 추천.

6) 사용
- 브라우저: http://localhost:8000
- /chat : 자연어로 “EDA 해줘 / 이상치 박스플롯” 같은 요청 수행
- /run_workflow : 업로드→분석→전처리→시각화→학습→리포트 원클릭

```


## License
이 프로젝트는 **MIT Licens**를 따릅니다.
자세한 내용은 [LICENSE](./LICENSE) 파일을 참고하세요.

> 본 프로젝트는 연구 및 공모전 시연용으로 제공되며,  
> Agentica, FastAPI, OpenAI SDK 등의 오픈소스 라이브러리를 포함합니다.


### Third-Party Notice
- [Agentica](https://github.com/wrtnlabs/agentica) (MIT License)  
- [FastAPI](https://fastapi.tiangolo.com/) (MIT License)  
- [OpenAI SDK](https://github.com/openai/openai-python) (MIT License)

