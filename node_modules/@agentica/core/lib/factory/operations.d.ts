import type { ILlmSchema } from "@samchon/openapi";
import type { AgenticaOperation } from "../context/AgenticaOperation";
import type { AgenticaOperationSelection } from "../context/AgenticaOperationSelection";
export declare function createOperationSelection<Model extends ILlmSchema.Model>(props: {
    operation: AgenticaOperation<Model>;
    reason: string;
}): AgenticaOperationSelection<Model>;
