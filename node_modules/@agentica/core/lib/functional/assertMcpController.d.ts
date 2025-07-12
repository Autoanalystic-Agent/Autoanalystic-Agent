import type { ILlmSchema, IMcpLlmApplication } from "@samchon/openapi";
import type { IAgenticaController } from "../structures/IAgenticaController";
/**
 * Create an MCP controller with type assertion.
 *
 * Create an {@link IAgenticaController.IMcp} instance which represents
 * an MCP (Model Context Protocol) controller with LLM function calling
 * schemas and client connection.
 *
 * @param props Properties to create the MCP controller
 * @param props.name Name of the MCP implementation.
 * @param props.client Client connection to the MCP implementation.
 * @param props.model Model schema of the LLM function calling.
 * @param props.options Options to create the MCP controller.
 * @returns MCP LLM application instance
 * @author sunrabbit123
 */
export declare function assertMcpController<Model extends ILlmSchema.Model>(props: {
    name: string;
    model: Model;
    client: IAgenticaController.IMcp<Model>["client"];
    options?: Partial<IMcpLlmApplication.IOptions<Model>>;
}): Promise<IAgenticaController.IMcp<Model>>;
