# AI 에이전트 기반 데이터 분석 툴

CSV 업로드만으로 기초 통계 → 전처리 → 시각화 → 모델 학습 → 리포트까지 한 번에 수행하는 에이전트 기반 데이터 분석 파이프라인입니다. 프로젝트 저장소와 시연 영상은 아래에서 확인할 수 있습니다.

- Repo: [github.com/Autoanalystic-Agent/Autoanalystic-Agent](https://github.com/Autoanalystic-Agent/Autoanalystic-Agent)
- Demo: [youtu.be/AFvnkW1hJkA](https://youtu.be/AFvnkW1hJkA)

본 프로젝트는 “CSV 데이터 분석 파이프라인 자동화 에이전트”를 목표로 하며, 비전문가도 쉽게 분석을 수행하도록 설계되었습니다.

## 구성 파일
| 파일/디렉터리                          | 설명                                                                                                 |
| -------------------------------- | -------------------------------------------------------------------------------------------------- |
| `src/outputs/`                   | 모든 산출물의 표준 저장 경로. 차트 이미지, 전처리 CSV, 모델, 리포트 등을 보관합니다.                                               |
| `src/uploads/`                   | 업로드된 CSV 파일 저장 경로. (FASTAPI 설정)                                                                    |
| `fastapi_main.py`                | FastAPI 백엔드·템플릿 렌더링·정적 산출물 서빙 구성 및 `/run_workflow`, `/chat` 라우팅. 산출물 URL 매핑 및 단계 카드 렌더링을 포함합니다.    |
| `scripts/train_ml_model.py`      | 전처리된 CSV로 XGBoost 기반 학습/평가를 수행하고 모델을 저장합니다.                                                        |
| `scripts/visualize_from_json.py` | Selector 결과(추천 페어)를 입력으로 받아 Boxplot/Scatterplot 등 차트를 생성해 `src/outputs/`에 저장합니다.                   |
| `templates/`                     | Jinja2 기반 UI(업로드/미리보기/채팅/워크플로 단계 카드).                                                              |

## 사용 기술
언어/런타임: Python(FastAPI), TypeScript(Node.js)

프론트엔드: HTML + Jinja2 템플릿

데이터/시각화: Pandas, Matplotlib, Seaborn

ML/딥러닝: scikit-learn, XGBoost, TensorFlow/Keras

연동/실행: Node.js child_process 로 파이썬 스크립트 실행, csv-stringify 등

개발도구/운영: VSCode, pip / npm, dotenv, git, Windows 환경


## 모델(에이전트) 설명

아키텍처 개요: LLM이 사용자 의도를 해석해 Basic/Preprocess/Viz/ML 툴을 자동 조합하여 실행하는 에이전트 라우팅 구조입니다. 필요 시 Direct Execute(원클릭)로 전체 파이프라인을 일괄 수행합니다.

주요 기능:
① BasicAnalysisTool(기초 통계) <br>
② SelectorTool(핵심 컬럼·시각화·전처리·ML 권고) <br>
③ VisualizationTool(Box/Scatter 등) <br>
④ PreprocessingTool(결측·인코딩·스케일링) v
⑤ MachineLearningTool ⑥ WorkflowTool(E2E)<br>

세션 컨텍스트: 세션 키별 in-memory history(text/describe)로 연속 대화의 일관성을 유지합니다.

산출물 표준화: 업로드→기초분석→전처리→시각화→모델학습→리포트 결과물을 src/outputs/{sessionId}/ 하위에 일괄 저장합니다.

### 적용 예시 (간단 실행):
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



### ⚙️ Third-Party Notice
- [Agentica](https://github.com/agentica-ai/agentica) (MIT License)  
- [FastAPI](https://fastapi.tiangolo.com/) (MIT License)  
- [OpenAI SDK](https://github.com/openai/openai-python) (MIT License)

