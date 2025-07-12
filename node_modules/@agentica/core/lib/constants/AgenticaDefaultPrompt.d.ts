import type { ILlmSchema } from "@samchon/openapi";
import type { IAgenticaConfig } from "../structures/IAgenticaConfig";
import type { IMicroAgenticaConfig } from "../structures/IMicroAgenticaConfig";
export declare function write<Model extends ILlmSchema.Model>(config?: IAgenticaConfig<Model> | IMicroAgenticaConfig<Model>): string;
export declare const AgenticaDefaultPrompt: {
    write: typeof write;
};
