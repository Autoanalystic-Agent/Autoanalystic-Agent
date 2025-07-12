import type { ILlmSchema } from "@samchon/openapi";
import type { AgenticaContext } from "../context/AgenticaContext";
import type { IAgenticaExecutor } from "../structures/IAgenticaExecutor";
export declare function execute<Model extends ILlmSchema.Model>(executor: Partial<IAgenticaExecutor<Model>> | null): (ctx: AgenticaContext<Model>) => Promise<void>;
