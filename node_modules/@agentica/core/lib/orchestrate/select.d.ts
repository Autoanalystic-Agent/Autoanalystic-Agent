import type { ILlmSchema } from "@samchon/openapi";
import type { AgenticaContext } from "../context/AgenticaContext";
export declare function select<Model extends ILlmSchema.Model>(ctx: AgenticaContext<Model>): Promise<void>;
