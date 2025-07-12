import type { ILlmSchema } from "@samchon/openapi";
import type { AgenticaOperation } from "./context/AgenticaOperation";
import type { MicroAgenticaEvent } from "./events/MicroAgenticaEvent";
import type { AgenticaUserMessageContent } from "./histories";
import type { MicroAgenticaHistory } from "./histories/MicroAgenticaHistory";
import type { IAgenticaController } from "./structures/IAgenticaController";
import type { IAgenticaVendor } from "./structures/IAgenticaVendor";
import type { IMicroAgenticaConfig } from "./structures/IMicroAgenticaConfig";
import type { IMicroAgenticaProps } from "./structures/IMicroAgenticaProps";
import { AgenticaTokenUsage } from "./context/AgenticaTokenUsage";
/**
 * Micro AI chatbot.
 *
 * `MicroAgentica` is a facade class for the micro AI chatbot agent
 * which performs LLM (Large Language Model) function calling from the
 * {@link conversate user's conversation} and manages the
 * {@link getHistories prompt histories}.
 *
 * Different between `MicroAgentica` and {@link Agentica} is that
 * `MicroAgentica` does not have function selecting filter. It directly
 * list up every functions to the agent. Besides, {@link Agentica} has
 * a function selecting mechanism to reduce the number of functions to
 * be listed up to the agent.
 *
 * Therefore, if you have a lot of functions to call, you must not
 * use this `MicroAgentica` class. Use this `MicroAgentica` class only
 * when you have a few functions to call.
 *
 * - [Multi-agent orchestration of `@agentica`](https://wrtnlabs.io/agentica/docs/concepts/function-calling/#orchestration-strategy)
 * - Internal agents of `MicroAgentica`
 *   - executor
 *   - describier
 * - Internal agents of {@link Agentica}
 *   - initializer
 *   - **selector**
 *   - executor
 *   - describer
 *
 * @author Samchon
 */
export declare class MicroAgentica<Model extends ILlmSchema.Model> {
    private readonly props;
    private readonly operations_;
    private readonly histories_;
    private readonly token_usage_;
    private readonly listeners_;
    private readonly semaphore_;
    /**
     * Initializer Constructor.
     *
     * @param props Properties to construct the micro agent
     */
    constructor(props: IMicroAgenticaProps<Model>);
    /**
     * Conversate with the micro agent.
     *
     * User talks to the AI chatbot with the given content.
     *
     * When the user's conversation implies the AI chatbot to execute a
     * function calling, the returned chat prompts will contain the
     * function callinng information like {@link AgenticaExecuteHistory}
     *
     * @param content The content to talk
     * @returns List of newly created histories
     */
    conversate(content: string | AgenticaUserMessageContent | Array<AgenticaUserMessageContent>): Promise<MicroAgenticaHistory<Model>[]>;
    /**
     * Get configuration.
     */
    getConfig(): IMicroAgenticaConfig<Model> | undefined;
    /**
     * Get LLM vendor.
     */
    getVendor(): IAgenticaVendor;
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
     * Get controllers.
     *
     * Get list of controllers, which are the collection of functions that
     * the agent can execute.
     */
    getControllers(): ReadonlyArray<IAgenticaController<Model>>;
    /**
     * Get the chatbot's histories.
     *
     * Get list of chat histories that the chatbot has been conversated.
     *
     * @returns List of chat histories
     */
    getHistories(): MicroAgenticaHistory<Model>[];
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
    on<Type extends MicroAgenticaEvent.Type>(type: Type, listener: (event: MicroAgenticaEvent.Mapper<Model>[Type]) => void | Promise<void>): this;
    /**
     * Erase an event listener.
     *
     * Erase an event listener to stop calling the callback function.
     *
     * @param type Type of event
     * @param listener Callback function to erase
     */
    off<Type extends MicroAgenticaEvent.Type>(type: Type, listener: (event: MicroAgenticaEvent.Mapper<Model>[Type]) => void | Promise<void>): this;
    private dispatch;
}
