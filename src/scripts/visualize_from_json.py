import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import sys
import os
import json
import numpy as np

# 인자 받기 (csv경로, json문자열, 결과 저장 폴더)
file_path = sys.argv[1]
selector_result_json = sys.argv[2]
output_dir = sys.argv[3]

# JSON 문자열 파싱
selector_result = json.loads(selector_result_json)

# CSV 파일 로드
df = pd.read_csv(file_path)

# 시각화 스타일 설정
sns.set(style="whitegrid")

# 추천 페어 중요도 기준으로 정렬 후 top N 추출
def get_top_pairs(df, recommendedPairs, top_n=5):
    scored_pairs = []
    for pair in recommendedPairs:
        col1, col2 = pair["column1"], pair["column2"]
        if col1 not in df.columns or col2 not in df.columns:
            continue

        # 점수 계산
        score = 0
        if pd.api.types.is_numeric_dtype(df[col1]):
            score += df[col1].var() if df[col1].var() > 0 else 0
        else:
            score += 1 / (df[col1].nunique() + 1e-6)
        if pd.api.types.is_numeric_dtype(df[col2]):
            score += df[col2].var() if df[col2].var() > 0 else 0
        else:
            score += 1 / (df[col2].nunique() + 1e-6)
        scored_pairs.append((score, pair))
    
    # 점수 높은 순 정렬 후 top N
    scored_pairs.sort(reverse=True, key=lambda x: x[0])
    return [p[1] for p in scored_pairs[:top_n]]

# top 5 페어 가져오기
top_pairs = get_top_pairs(df, selector_result.get("recommendedPairs", []), top_n=5)
if not top_pairs:
    print("추천된 컬럼 페어가 없습니다. 시각화를 수행할 수 없습니다.")
    # A. 단일 컬럼: 수치형 중 분산이 가장 큰 컬럼 1개 (분포 확인용)
    numeric_cols = df.select_dtypes(include=['number']).columns
    if not numeric_cols.empty:
        var_series = df[numeric_cols].var().sort_values(ascending=False)
        top_single_col = var_series.index[0]
        
        # 분포 시각화 (히스토그램)
        try:
            plt.figure(figsize=(8, 6))
            sns.histplot(df[top_single_col], kde=True)
            plt.title(f"Distribution of {top_single_col}")
            plt.tight_layout()
            file_name = f"Distribution_of_{top_single_col}.png".replace(" ", "_")
            file_path_out = os.path.join(output_dir, file_name)
            plt.savefig(file_path_out)
            plt.close()
        except Exception as e:
            print(f"오류: 단일 컬럼 {top_single_col} 시각화 실패 → {e}")
            
    # B. 페어 생성: 상관계수가 가장 높은 상위 3개 수치형 페어
    if len(numeric_cols) >= 2:
        corr_matrix = df[numeric_cols].corr().abs()
        np.fill_diagonal(corr_matrix.values, 0) # 자기 자신과의 상관계수 제외
        
        # 상관계수가 높은 상위 3개 페어 추출
        upper = corr_matrix.where(pd.np.triu(pd.np.ones(corr_matrix.shape), k=1).astype(bool))
        sorted_corr = upper.stack().sort_values(ascending=False).head(3)

        for (col1, col2), corr_value in sorted_corr.items():
            top_pairs.append({"column1": col1, "column2": col2})

    if not top_pairs:
        print("시각화를 수행할 수 있는 컬럼 페어를 찾지 못했습니다.")
        sys.exit(0) # 시각화할 것이 없으면 종료

# 시각화
for pair in top_pairs:
    col1 = pair["column1"]
    col2 = pair["column2"]

    plt.figure(figsize=(8, 6))

    try:
        col1_numeric = pd.api.types.is_numeric_dtype(df[col1])
        col2_numeric = pd.api.types.is_numeric_dtype(df[col2])
        col1_unique = df[col1].nunique()
        col2_unique = df[col2].nunique()

        # col1 수치 + col2 범주 또는 고유값 적음 -> boxplot
        if col1_numeric and (not col2_numeric or col2_unique <= 10):
            sns.boxplot(x=col2, y=col1, data=df)
            plt.title(f"{col1} by {col2}")
        # col2 수치 + col1 범주 -> boxplot 반대로
        elif col2_numeric and (not col1_numeric or col1_unique <= 10):
            sns.boxplot(x=col1, y=col2, data=df)
            plt.title(f"{col2} by {col1}")
        # 둘 다 수치형 -> scatterplot
        elif col1_numeric and col2_numeric:
            hue_col = selector_result.get("selectedColumns")[-1] if selector_result.get("selectedColumns") else None
            if hue_col and hue_col in df.columns:
                sns.scatterplot(x=col1, y=col2, hue=df[hue_col])
            else:
                sns.scatterplot(x=col1, y=col2, data=df)
            plt.title(f"{col1} vs {col2}")
        # 둘 다 범주형 -> countplot
        else:
            sns.countplot(x=col1, hue=col2, data=df)
            plt.title(f"{col1} count by {col2}")

        plt.tight_layout()
        file_name = f"{col1}_vs_{col2}.png".replace(" ", "_")
        print(output_dir)
        file_path_out = os.path.join(output_dir, file_name)
        plt.savefig(file_path_out)
        plt.close()

    except Exception as e:
        print(f"오류: {col1} - {col2} 시각화 실패 → {e}")
