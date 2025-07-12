import type { ILlmSchema } from "@samchon/openapi";
import type { AgenticaContext } from "../context/AgenticaContext";
export declare function initialize<Model extends ILlmSchema.Model>(ctx: AgenticaContext<Model>): Promise<void>;
