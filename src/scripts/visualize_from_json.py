import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import sys
import os
import json

# 인자 받기 (csv경로, json문자열, 결과 저장 폴더)
file_path = sys.argv[1]
selector_result_json = sys.argv[2]
output_dir = sys.argv[3]

# JSON 문자열을 파싱
selector_result = json.loads(selector_result_json)

# CSV 파일 로드
df = pd.read_csv(file_path)

# 시각화 스타일 설정
sns.set(style="whitegrid")

# 추천된 컬럼 페어 기반 시각화 생성
for pair in selector_result["recommendedPairs"]:
    col1 = pair["column1"]
    col2 = pair["column2"]

    plt.figure(figsize=(8, 6))

    try:
        # col2가 범주형이면 박스플롯, 아니면 산점도
        if df[col2].dtype == "object" or df[col2].nunique() <= 10:
            sns.boxplot(data=df, x=col2, y=col1)
            plt.title(f"{col1} by {col2}")
        # 둘 다 수치형일 경우 산점도
        else:
            hue_col = selector_result["selectedColumns"][-1]  # 마지막 컬럼이 종(target)이라 가정
            sns.scatterplot(data=df, x=col1, y=col2, hue=df[hue_col])
            plt.title(f"{col1} vs {col2} by {hue_col}")

        plt.tight_layout()

        # 파일 저장
        file_name = f"{col1}_vs_{col2}.png".replace(" ", "_")
        file_path = os.path.join(output_dir, file_name)
        plt.savefig(file_path)
        plt.close()

    except Exception as e:
        print(f"⚠️ 오류: {col1} - {col2} 시각화 실패 → {e}")
