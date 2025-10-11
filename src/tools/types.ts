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
}
export interface BasicAnalysisOutput {
  columnStats: ColumnStat[];
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
}

// ── SelectorTool ───────────────────────────────────────────
export interface SelectorInput {
  columnStats: ColumnStat[];
  correlationResults?: {  // 상관관계 분석 결과
    method: string;
    correlationMatrix: Record<string, Record<string, number>>;
    highCorrPairs: CorrelationPair[];
  };
  hint?: {
    targetColumn?: string | null;
    problemType?: ProblemType;
  };
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
}

// ── VisualizationTool ──────────────────────────────────────
export interface VisualizationInput {
  filePath: string;
  selectorResult: Pick<SelectorOutput, 'selectedColumns' | 'recommendedPairs'>;
  correlation?: { matrixPath?: string; heatmapPath?: string }; // 선택
}
export interface VisualizationOutput {
  chartPaths: string[];
}

// ── PreprocessingTool ──────────────────────────────────────
export interface PreprocessingInput {
  filePath: string;
  recommendations: PreprocessStep[];
}
export interface PreprocessingOutput {
  preprocessedFilePath?: string;
  messages?: string[];
}

// ── MachineLearningTool ────────────────────────────────────
export interface MachineLearningInput {
  filePath: string; // 전처리 산출물(없으면 원본)
  selectorResult: {
    targetColumn?: string;
    problemType?: Exclude<ProblemType, null>;
    mlModelRecommendation?: SelectorOutput['mlModelRecommendation'];
  };
}
export interface MachineLearningOutput {
  reportPath: string;        // 핵심 교차 필드
  // 나머지는 자유 (원하면 확장)
  [k: string]: any;
}

// ── Workflow 전체 반환(화면 바인딩에 쓰는 표면) ───────────────
export interface WorkflowResult {
  filePath: string;
  columnStats: ColumnStat[];
  correlationResult?: {                       // 상관관계 분석 결과 추가
    method: string;
    correlationMatrix: Record<string, Record<string, number>>;
    highCorrPairs: CorrelationPair[];
  };
  selectedColumns: string[];
  recommendedPairs: { column1: string; column2: string }[];
  preprocessingRecommendations: PreprocessStep[];
  targetColumn: string | null;
  problemType: Exclude<ProblemType, null> | null;
  mlModelRecommendation: SelectorOutput['mlModelRecommendation'];
  chartPaths: string[];
  preprocessedFilePath?: string;
  mlResultPath?: { reportPath: string }; // FastAPI가 기대하는 표면
}
