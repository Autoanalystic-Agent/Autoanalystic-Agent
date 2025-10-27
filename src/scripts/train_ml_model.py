import sys
import json
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, mean_squared_error
import joblib
import os
from sklearn.preprocessing import LabelEncoder

# ───────────────────────────────────────────────
# 1. 인자 받아오기
# ───────────────────────────────────────────────
file_path = sys.argv[1]
selector_result = json.loads(sys.argv[2]) if len(sys.argv) > 2 else {}
output_dir = sys.argv[3]
timestamp = sys.argv[4]

df = pd.read_csv(file_path)

# ───────────────────────────────────────────────
# 2. 안전한 파싱 (NoneType 방지)
# ───────────────────────────────────────────────
target = selector_result.get("targetColumn")
problem_type = selector_result.get("problemType", "classification")
ml_rec = selector_result.get("mlModelRecommendation")

# ✅ 기본 모델 Fallback
if not ml_rec or not isinstance(ml_rec, dict):
    print("[WARN] mlModelRecommendation이 None이므로 기본 모델을 사용합니다.")
    ml_rec = {
        "model": "LogisticRegression" if problem_type == "classification" else "LinearRegression",
        "params": {},
        "reason": "기본 모델 사용 (추천 없음)"
    }

model_name = ml_rec.get("model", "LogisticRegression")
params = ml_rec.get("params", {})

# ───────────────────────────────────────────────
# 3. 입력 데이터 구성
# ───────────────────────────────────────────────
# One-hot 전처리된 컬럼 이름들 확인
target_cols = [c for c in df.columns if target in c] if target else []
if not target_cols:
    # fallback — 마지막 컬럼을 타깃으로 사용
    target_cols = [df.columns[-1]]
    print(f"[WARN] targetColumn을 찾지 못해 '{target_cols[0]}'를 타깃으로 사용합니다.")

X_drop = df.drop(labels=target_cols, axis=1)
valid_types = ['int64', 'float64', 'bool', 'category']
X = X_drop.select_dtypes(include=valid_types)
y = df[target_cols[0]]

if problem_type == "classification":
    le = LabelEncoder()
    y = le.fit_transform(y)
else:
    le = None

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# ───────────────────────────────────────────────
# 4. 모델 로딩 함수 (모든 경우 대비)
# ───────────────────────────────────────────────
def load_model(model_name: str, params: dict):
    if "XGBoost" in model_name:
        from xgboost import XGBRegressor, XGBClassifier
        return XGBRegressor(**params) if "Regressor" in model_name else XGBClassifier(**params)
    elif "RandomForest" in model_name:
        from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
        return RandomForestRegressor(**params) if "Regressor" in model_name else RandomForestClassifier(**params)
    elif "LinearRegression" in model_name:
        from sklearn.linear_model import LinearRegression
        return LinearRegression(**params)
    elif "LogisticRegression" in model_name:
        from sklearn.linear_model import LogisticRegression
        return LogisticRegression(**params)
    else:
        print(f"[WARN] 지원하지 않는 모델명 '{model_name}', 기본 모델로 대체합니다.")
        from sklearn.linear_model import LogisticRegression, LinearRegression
        return LogisticRegression() if problem_type == "classification" else LinearRegression()

# ───────────────────────────────────────────────
# 5. 모델 학습 및 평가
# ───────────────────────────────────────────────
model = load_model(model_name, params)
model.fit(X_train, y_train)

if problem_type == 'regression':
    y_pred = model.predict(X_test)
    mse = mean_squared_error(y_test, y_pred)
    result_text = f"모델: {model_name}\nMSE: {mse:.4f}\n"
else:
    y_pred = model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    result_text = f"모델: {model_name}\n정확도: {acc:.4f}\n"

# ───────────────────────────────────────────────
# 6. 결과 저장
# ───────────────────────────────────────────────
result_path = os.path.join(output_dir, f"ml_result_{timestamp}.txt")
with open(result_path, "w", encoding="utf-8") as f:
    f.write(result_text)

joblib.dump(model, os.path.join(output_dir, f"model_{timestamp}.pkl"))

print(result_text)
