import type { ChatCompletion, ChatCompletionChunk, ChatCompletionMessageToolCall } from "openai/resources";
declare function transformCompletionChunk(source: string | Uint8Array): ChatCompletionChunk;
declare function accumulate(origin: ChatCompletion, chunk: ChatCompletionChunk): ChatCompletion;
declare function merge(chunks: ChatCompletionChunk[]): ChatCompletion;
declare function mergeChoice(acc: ChatCompletion.Choice, cur: ChatCompletionChunk.Choice): ChatCompletion.Choice;
declare function mergeToolCalls(acc: ChatCompletionMessageToolCall, cur: ChatCompletionChunk.Choice.Delta.ToolCall): ChatCompletionMessageToolCall;
export declare const ChatGptCompletionMessageUtil: {
    transformCompletionChunk: typeof transformCompletionChunk;
    accumulate: typeof accumulate;
    merge: typeof merge;
    mergeChoice: typeof mergeChoice;
    mergeToolCalls: typeof mergeToolCalls;
};
export {};
