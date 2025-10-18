// 공통 기초 타입
export type DType = 'numeric' | 'categorical' | 'datetime' | 'text' | string;
export type CorrMethod = 'pearson' | 'spearman' | 'kendall';
export type ProblemType = 'regression' | 'classification' | null;

export interface ColumnStat {
  column: string;
  dtype: DType;
  missing: number;
  unique: number;
  mean?: number;
  std?: number;
}

// ── BasicAnalysisTool ───────────────────────────────────────
export interface BasicAnalysisInput {
  filePath: string;
  outputDir?: string;                  // [ADD] 산출물 저장 폴더(옵션)
}
export interface BasicAnalysisOutput {
  columnStats: ColumnStat[];
  summaryPath?: string;                // [ADD] 선택적으로 JSON/텍스트 저장 시
}



// ── CorrelationTool (신규) ─────────────────────────────────
export interface CorrelationPair {
  col1: string;
  col2: string;
  corr: number;     // -1..1
}

export interface CorrelationInput {
  data: Record<string, number[]>;
  method?: CorrMethod;  // default "pearson"
  dropna?: boolean;     // default true
  threshold?: number;   // high correlation 기준, default 0.5
}

export interface CorrelationOutput {
  method: CorrMethod;
  correlationMatrix: Record<string, Record<string, number>>;
  highCorrPairs: CorrelationPair[];
  matrixCsvPath?: string;              // [ADD] (있으면) 저장된 상관행렬 CSV 경로
  highPairsJsonPath?: string;          // [ADD] (있으면) 저장된 페어 JSON 경로
}


// ── SelectorTool ───────────────────────────────────────────
export interface SelectorInput {
  columnStats: ColumnStat[];
  // Correlation 결과 일부만 받으면 됨
  correlationResults?: {  // 상관관계 분석 결과
    method: string;
    correlationMatrix: Record<string, Record<string, number>>;
    highCorrPairs: CorrelationPair[];
  };
  // (선택) Hint
  hint?: { targetColumn?: string | null; problemType?: ProblemType };
  outputDir?: string;
}

export interface PreprocessStep {
  column: string;
  fillna?: 'drop' | 'mean' | 'mode';
  normalize?: 'minmax' | 'zscore';
  encoding?: 'label' | 'onehot';
}

export interface SelectorOutput {
  selectedColumns: string[];
  recommendedPairs: { column1: string; column2: string; reason?: string }[];
  preprocessingRecommendations: PreprocessStep[];
  targetColumn: string | null;
  problemType: ProblemType;
  mlModelRecommendation: {
    model: string;
    score: number;
    reason: string;
    params: Record<string, any>;
    alternatives: {
      model: string;
      score: number;
      reason: string;
      params: Record<string, any>;
    }[];
  } | null;
  summaryPath?: string;  
}

// ── VisualizationTool ──────────────────────────────────────
export interface VisualizationInput {
  filePath: string;
  selectorResult: Pick<SelectorOutput, 'selectedColumns' | 'recommendedPairs'>;
  correlation?: { matrixPath?: string; heatmapPath?: string }; // 선택
  outputDir?: string;
}
export interface VisualizationOutput {
  chartPaths: string[];
}

// ── PreprocessingTool ──────────────────────────────────────
export interface PreprocessingInput {
  filePath: string;
  recommendations: PreprocessStep[];
  outputDir?: string;
}
export interface PreprocessingOutput {
  preprocessedFilePath?: string;
  messages?: string[];
  outputDir?: string;
}

// ── MachineLearningTool ────────────────────────────────────
export interface MachineLearningInput {
  filePath: string; // 전처리 산출물(없으면 원본)
  selectorResult: {
    targetColumn?: string;
    problemType?: Exclude<ProblemType, null>;
    mlModelRecommendation?: SelectorOutput['mlModelRecommendation'];
  };
  outputDir?: string;
}
export interface MachineLearningOutput {
  reportPath: string;        // 핵심 교차 필드
  modelPath?: string;        // [ADD] 모델 저장 경로(옵션)
  [k: string]: any;
}

// ── Workflow 전체 반환(화면 바인딩에 쓰는 표면) ───────────────
export interface WorkflowResult {
  filePath: string;
  columnStats: ColumnStat[];
  correlationResults?: CorrelationOutput;
  selectedColumns: string[];
  recommendedPairs: { column1: string; column2: string }[];
  preprocessingRecommendations: PreprocessStep[];
  targetColumn: string | null;
  problemType: Exclude<ProblemType, null> | null;
  mlModelRecommendation: SelectorOutput['mlModelRecommendation'];
  chartPaths: string[];
  preprocessedFilePath?: string;
  mlResultPath?: { reportPath: string }; // FastAPI가 기대하는 표면
  outputsRoot?: string;                  // [ADD] 세션/런 기준 산출물 루트(우측 패널 목록화용)
}
