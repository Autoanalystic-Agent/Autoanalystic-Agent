import type { ILlmSchema } from "@samchon/openapi";
import type { AgenticaContext } from "../context/AgenticaContext";
export declare function cancel<Model extends ILlmSchema.Model>(ctx: AgenticaContext<Model>): Promise<void>;
