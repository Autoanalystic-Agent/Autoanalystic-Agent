import type { ILlmSchema } from "@samchon/openapi";
import type { AgenticaAssistantMessageHistory } from "./AgenticaAssistantMessageHistory";
import type { AgenticaDescribeHistory } from "./AgenticaDescribeHistory";
import type { AgenticaExecuteHistory } from "./AgenticaExecuteHistory";
import type { AgenticaUserMessageHistory } from "./AgenticaUserMessageHistory";
export type MicroAgenticaHistory<Model extends ILlmSchema.Model> = AgenticaDescribeHistory<Model> | AgenticaExecuteHistory<Model> | AgenticaAssistantMessageHistory | AgenticaUserMessageHistory;
export declare namespace MicroAgenticaHistory {
    type Type = MicroAgenticaHistory<any>["type"];
    interface Mapper<Model extends ILlmSchema.Model> {
        describe: AgenticaDescribeHistory<Model>;
        execute: AgenticaExecuteHistory<Model>;
        userMessage: AgenticaUserMessageHistory;
        assistantMessage: AgenticaAssistantMessageHistory;
    }
}
