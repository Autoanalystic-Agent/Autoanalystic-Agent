// src/agent/AgentController.ts

import { SelectorTool } from "../tools/SelectorTool";
import { VisualizationTool } from "../tools/VisualizationTool"; // 가상의 시각화 도구
import { MachineLearningTool } from "../tools/MachineLearningTool"; // 가상의 ML 도구
import { 
    SelectorInput, 
    SelectorOutput, 
    VisualizationInput, 
    VisualizationOutput,
    MachineLearningInput, 
    MachineLearningOutput,
    ProblemType 
} from "../tools/types"; // 모든 타입 정의가 types.ts에 있다고 가정

// -----------------------------------------------------------
// 1. 세션 컨텍스트 (Session Context) 타입 정의
// -----------------------------------------------------------

// VisualizationTool과 MachineLearningTool에 필요한 SelectorOutput의 핵심 부분만 정의
interface SavedSelectorContext {
    // VisualizationInput에 필요한 필드
    selectedColumns: SelectorOutput['selectedColumns'];
    recommendedPairs: SelectorOutput['recommendedPairs'];
    
    // MachineLearningInput에 필요한 필드 (null 처리)
    targetColumn: string | null;
    problemType: ProblemType;
    mlModelRecommendation: SelectorOutput['mlModelRecommendation'];
    
    // 이 파일 경로들은 전처리/데이터 로드 단계에서 준비되어야 함
    filePath: string;           // 현재 데이터 파일 경로 (전처리 산출물 경로)
    correlationMatrixPath?: string;
    correlationHeatmapPath?: string;
}

// 에이전트가 세션별로 유지해야 하는 전체 상태
interface SessionContext {
    sessionId: string;
    selectorData: SavedSelectorContext | null; // SelectorTool 결과를 저장할 변수
    // 기타 세션 정보
    [key: string]: any; 
}


// -----------------------------------------------------------
// 2. Agent Controller 클래스
// -----------------------------------------------------------

export class AgentController {
    private sessionContexts: Map<string, SessionContext> = new Map();

    private getContext(sessionId: string): SessionContext {
        if (!this.sessionContexts.has(sessionId)) {
            // 초기 Context 설정 (임시 파일 경로 설정)
            this.sessionContexts.set(sessionId, { 
                sessionId,
                selectorData: null,
                // 실제 데이터 로드 단계에서 이 경로가 설정되어야 함
                currentFilePath: `data/preprocessed_${sessionId}.csv` 
            });
        }
        return this.sessionContexts.get(sessionId)!;
    }

    /**
     * "주요 컬럼 추천해줘" 요청 처리 및 결과를 Context에 저장합니다.
     */
    public async handleSelectorRequest(sessionId: string, selectorInput: SelectorInput): Promise<string> {
        const context = this.getContext(sessionId);

        const selectorTool = new SelectorTool();
        const selectorOutput = await selectorTool.run(selectorInput);

        // 🚨 핵심 로직: SelectorTool의 결과를 Context에 저장 
        context.selectorData = {
            selectedColumns: selectorOutput.selectedColumns,
            recommendedPairs: selectorOutput.recommendedPairs,
            targetColumn: selectorOutput.targetColumn,
            problemType: selectorOutput.problemType,
            mlModelRecommendation: selectorOutput.mlModelRecommendation,
            filePath: context.currentFilePath, // 현재 데이터 파일 경로
            // 상관분석 결과 경로도 SelectorTool Input에 있었다면 여기서 저장할 수 있음
            correlationMatrixPath: undefined,
        };

// 🌟 확인 단계: 저장된 context.selectorData의 내용을 출력
        console.log("--- Selector 결과 저장 완료 (Context 확인) ---");
        console.log("저장된 targetColumn:", context.selectorData.targetColumn);
        console.log("저장된 problemType:", context.selectorData.problemType);
        // mlModelRecommendation은 객체이므로 전체 출력 (필요 시 JSON.stringify 사용)
        console.log("저장된 mlModelRecommendation:", JSON.stringify(context.selectorData.mlModelRecommendation, null, 2));
        console.log("------------------------------------------");        

        const targetInfo = selectorOutput.targetColumn 
            ? `타겟: ${selectorOutput.targetColumn}, 유형: ${selectorOutput.problemType}`
            : `타겟을 찾을 수 없습니다.`;
            
        return `✅ 컬럼 추천 및 분석 준비 완료. ${targetInfo}. 이 결과를 바탕으로 시각화나 예측 모델을 만들 수 있습니다.`;
    }

    // ---

    /**
     * "시각화해줘" 요청 처리: 저장된 Context를 VisualizationTool에 전달
     */
public async handleVisualizationRequest(sessionId: string): Promise<string> {
        const context = this.getContext(sessionId);

        if (!context.selectorData) {
            return "❌ 시각화를 위해 먼저 '주요 컬럼 추천해줘'를 실행하여 컬럼을 준비해야 합니다.";
        }
        
        const visualizationInput: VisualizationInput = {
            filePath: context.selectorData.filePath,
            sessionId: context.sessionId,
            selectorResult: {
                selectedColumns: context.selectorData.selectedColumns,
                recommendedPairs: context.selectorData.recommendedPairs,
            },
            correlation: {
                matrixPath: context.selectorData.correlationMatrixPath,
            }
        };

        const visualizationTool = new VisualizationTool();
        // 🌟 타입 명시는 유지하며, 오류는 툴 정의가 VisualizationOutput을 반환한다고 가정하고 무시합니다.
        const visualizationOutput = await visualizationTool.run(visualizationInput) as VisualizationOutput;
        return `🖼️ 시각화 작업이 완료되었습니다. 생성된 차트: ${visualizationOutput.chartPaths.join(', ')}`;
    }

    // ---
    
    /**
     * "예측 모델 만들어줘" 요청 처리: 저장된 Context를 MachineLearningTool에 전달
     */
    public async handleMachineLearningRequest(sessionId: string): Promise<string> {
        const context = this.getContext(sessionId);

        if (!context.selectorData || !context.selectorData.targetColumn) {
            return "❌ 머신러닝을 위해 먼저 '주요 컬럼 추천해줘'를 실행하여 타겟 컬럼을 준비해야 합니다.";
        }
        console.log("--- ML Tool 입력 데이터 확인 ---");
        console.log("targetColumn for ML:", context.mlPrepData.targetColumn);
        console.log("problemType for ML:", context.mlPrepData.problemType);
        console.log("-------------------------------");

        // MachineLearningInput 인터페이스에 맞게 데이터 구성
        const mlInput: MachineLearningInput = {
            filePath: context.selectorData.filePath,
            sessionId: context.sessionId,
            selectorResult: {
                // problemType이 null이 아님을 보장
                targetColumn: context.selectorData.targetColumn,
                problemType: context.selectorData.problemType as Exclude<ProblemType, null>,
                mlModelRecommendation: context.selectorData.mlModelRecommendation,
            },
        };

        const mlTool = new MachineLearningTool();
        const mlOutput = await mlTool.run(mlInput) as MachineLearningOutput;

        return `✨ 머신러닝 모델(${(mlOutput as any).model}) 학습이 완료되었습니다. 결과 요약: ${mlOutput.reportPath}`;
    }
}