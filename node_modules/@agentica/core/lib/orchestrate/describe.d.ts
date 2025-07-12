import type { ILlmSchema } from "@samchon/openapi";
import type { AgenticaContext } from "../context/AgenticaContext";
import type { MicroAgenticaContext } from "../context/MicroAgenticaContext";
import type { AgenticaExecuteHistory } from "../histories/AgenticaExecuteHistory";
export declare function describe<Model extends ILlmSchema.Model>(ctx: AgenticaContext<Model> | MicroAgenticaContext<Model>, histories: AgenticaExecuteHistory<Model>[]): Promise<void>;
export declare const ChatGptDescribeFunctionAgent: {
    execute: typeof describe;
};
