import type { ILlmSchema } from "@samchon/openapi";
import type { AgenticaOperation } from "./context/AgenticaOperation";
import type { AgenticaEvent } from "./events/AgenticaEvent";
import type { AgenticaUserMessageContent } from "./histories";
import type { AgenticaHistory } from "./histories/AgenticaHistory";
import type { IAgenticaConfig } from "./structures/IAgenticaConfig";
import type { IAgenticaController } from "./structures/IAgenticaController";
import type { IAgenticaProps } from "./structures/IAgenticaProps";
import type { IAgenticaVendor } from "./structures/IAgenticaVendor";
import { AgenticaTokenUsage } from "./context/AgenticaTokenUsage";
/**
 * Agentica AI chatbot agent.
 *
 * `Agentica` is a facade class for the super AI chatbot agent
 * which performs LLM (Large Language Model) function calling from the
 * {@link conversate user's conversation}, and manages the
 * {@link getHistories prompt histories}.
 *
 * To understand and compose the `Agentica` class exactly, reference
 * below types concentrating on the documentation comments please.
 * Especially, you have to be careful about the {@link IAgenticaProps}
 * type which is used in the {@link constructor} function.
 *
 * - Constructors
 *   - {@link IAgenticaProps}
 *   - {@link IAgenticaVendor}
 *   - {@link IAgenticaController}
 *   - {@link IAgenticaConfig}
 *   - {@link IAgenticaSystemPrompt}
 * - Accessors
 *   - {@link IAgenticaOperation}
 *   - {@link IAgenticaHistoryJson}
 *   - {@link IAgenticaEventJson}
 *   - {@link IAgenticaTokenUsageJson}
 *
 * @author Samchon
 */
export declare class Agentica<Model extends ILlmSchema.Model> {
    private readonly props;
    private readonly operations_;
    private readonly stack_;
    private readonly histories_;
    private readonly listeners_;
    private readonly executor_;
    private readonly semaphore_;
    private readonly token_usage_;
    private ready_;
    /**
     * Initializer constructor.
     *
     * @param props Properties to construct the agent
     */
    constructor(props: IAgenticaProps<Model>);
    /**
     * Conversate with the AI chatbot.
     *
     * User talks to the AI chatbot with the given content.
     *
     * When the user's conversation implies the AI chatbot to execute a
     * function calling, the returned chat prompts will contain the
     * function calling information like {@link AgenticaExecuteHistory}.
     *
     * @param content The content to talk
     * @param options Options
     * @param options.abortSignal Abort signal
     * @throws AbortError
     * @returns List of newly created chat prompts
     */
    conversate(content: string | AgenticaUserMessageContent | Array<AgenticaUserMessageContent>, options?: {
        abortSignal?: AbortSignal;
    }): Promise<AgenticaHistory<Model>[]>;
    /**
     * Get configuration.
     */
    getConfig(): IAgenticaConfig<Model> | undefined;
    /**
     * Get LLM vendor.
     */
    getVendor(): IAgenticaVendor;
    /**
     * Get controllers.
     *
     * Get list of controllers, which are the collection of functions that
     * the "Super AI Chatbot" can execute.
     */
    getControllers(): ReadonlyArray<IAgenticaController<Model>>;
    /**
     * Get operations.
     *
     * Get list of operations, which has capsuled the pair of controller
     * and function from the {@link getControllers controllers}.
     *
     * @returns List of operations
     */
    getOperations(): ReadonlyArray<AgenticaOperation<Model>>;
    /**
     * Get the chatbot's histories.
     *
     * Get list of chat histories that the chatbot has been conversated.
     *
     * @returns List of chat histories
     */
    getHistories(): AgenticaHistory<Model>[];
    /**
     * Get token usage of the AI chatbot.
     *
     * Entire token usage of the AI chatbot during the conversating
     * with the user by {@link conversate} method callings.
     *
     * @returns Cost of the AI chatbot
     */
    getTokenUsage(): AgenticaTokenUsage;
    /**
     * Add an event listener.
     *
     * Add an event listener to be called whenever the event is emitted.
     *
     * @param type Type of event
     * @param listener Callback function to be called whenever the event is emitted
     */
    on<Type extends AgenticaEvent.Type>(type: Type, listener: (event: AgenticaEvent.Mapper<Model>[Type]) => void | Promise<void>): this;
    /**
     * Erase an event listener.
     *
     * Erase an event listener to stop calling the callback function.
     *
     * @param type Type of event
     * @param listener Callback function to erase
     */
    off<Type extends AgenticaEvent.Type>(type: Type, listener: (event: AgenticaEvent.Mapper<Model>[Type]) => void | Promise<void>): this;
    private dispatch;
}
