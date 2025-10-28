import sys
import json
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, mean_squared_error
import joblib
import os
import importlib
from sklearn.preprocessing import LabelEncoder

# json 받아오기
file_path = sys.argv[1]
selector_result = json.loads(sys.argv[2])  # SelectorTool 결과 (JSON)
output_dir = sys.argv[3]               # 출력 디렉토리
timestamp = sys.argv[4]                # 타임스탬프

df = pd.read_csv(file_path)

target = selector_result.get("targetColumn")
problem_type = selector_result.get("problemType")
rec = selector_result.get("mlModelRecommendation") or {}          # [MINIMAL]
model_name = rec.get("model")                                     # [MINIMAL]
params = rec.get("params") or {}                                  # [MINIMAL]
if model_name is None:                                            # [MINIMAL]
    # problem_type에 따라 기본값 지정
    if problem_type == "regression":
        model_name = "RandomForestRegressor"
    else:
        # 분류 또는 미지정(None)일 때 분류로 폴백
        model_name = "RandomForestClassifier"

# one-hot 전처리된 컬럼 이름들 확인
target_cols = [c for c in df.columns if target in c]  # 'Embarked' → ['Embarked_C', 'Embarked_Q', 'Embarked_S']

if not target_cols:
    if target in df.columns:
        target_cols = [target]
    else:
        raise ValueError(f"타깃 컬럼({target})을(를) 찾을 수 없습니다.")  # [MINIMAL]
# ---------------------------------------------------------


X_drop = df.drop(labels=target_cols, axis=1)
valid_types = ['int64', 'float64', 'bool', 'category']
X = X_drop.select_dtypes(include=valid_types)
y = df[target_cols[0]]  # 기본적으로 첫 번째 컬럼 사용, 필요시 수정

if problem_type == "classification":
    le = LabelEncoder()
    y = le.fit_transform(y)
else:
    le = None


X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# model_name 예시: "XGBoostRegressor", "RandomForestClassifier"
def load_model(model_name: str, params: dict):
    if "XGBoost" in model_name:
        from xgboost import XGBRegressor, XGBClassifier
        if "Regressor" in model_name:
            return XGBRegressor(**params)
        else:
            return XGBClassifier(**params)
    elif "RandomForest" in model_name:
        from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
        if "Regressor" in model_name:
            return RandomForestRegressor(**params)
        else:
            return RandomForestClassifier(**params)
    elif "LinearRegression" in model_name:
        from sklearn.linear_model import LinearRegression
        return LinearRegression(**params)
    elif "LogisticRegression" in model_name:
        from sklearn.linear_model import LogisticRegression
        return LogisticRegression(**params)
    else:
        raise ValueError(f"지원하지 않는 모델: {model_name}")

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

os.makedirs(output_dir, exist_ok=True)


result_path = os.path.join(output_dir, f"ml_result_{timestamp}.txt")
with open(result_path, "w", encoding="utf-8") as f:
    f.write(result_text)


joblib.dump(model, os.path.join(output_dir, f"model_{timestamp}.pkl"))

print(result_text)
