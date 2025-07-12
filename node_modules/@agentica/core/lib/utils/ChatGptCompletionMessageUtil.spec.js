"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ChatGptCompletionMessageUtil_1 = require("./ChatGptCompletionMessageUtil");
describe("chatGptCompletionMessageUtil", () => {
    describe("transformCompletionChunk", () => {
        it("should transform string chunk to ChatCompletionChunk", () => {
            const chunk = {
                id: "test-id",
                choices: [{
                        index: 0,
                        delta: { content: "Hello" },
                    }],
                created: 1234567890,
                model: "gpt-4",
                object: "chat.completion.chunk",
            };
            const result = ChatGptCompletionMessageUtil_1.ChatGptCompletionMessageUtil.transformCompletionChunk(JSON.stringify(chunk));
            expect(result).toEqual(chunk);
        });
        it("should transform Uint8Array chunk to ChatCompletionChunk", () => {
            const chunk = {
                id: "test-id",
                choices: [{
                        index: 0,
                        delta: { content: "Hello" },
                    }],
                created: 1234567890,
                model: "gpt-4",
                object: "chat.completion.chunk",
            };
            const uint8Array = new TextEncoder().encode(JSON.stringify(chunk));
            const result = ChatGptCompletionMessageUtil_1.ChatGptCompletionMessageUtil.transformCompletionChunk(uint8Array);
            expect(result).toEqual(chunk);
        });
        it("should handle invalid JSON", () => {
            expect(() => {
                ChatGptCompletionMessageUtil_1.ChatGptCompletionMessageUtil.transformCompletionChunk("invalid json");
            }).toThrow();
        });
    });
    describe("accumulate", () => {
        it("should accumulate content from chunks", () => {
            var _a;
            const origin = {
                id: "test-id",
                choices: [{
                        index: 0,
                        // @ts-expect-error - refusal is not required
                        message: { role: "assistant", content: "Hello" },
                    }],
                created: 1234567890,
                model: "gpt-4",
                object: "chat.completion",
            };
            const chunk = {
                id: "test-id",
                // @ts-expect-error - finish_reason is not required
                choices: [{
                        index: 0,
                        delta: { content: " World" },
                    }],
                created: 1234567890,
                model: "gpt-4",
                object: "chat.completion.chunk",
            };
            const result = ChatGptCompletionMessageUtil_1.ChatGptCompletionMessageUtil.accumulate(origin, chunk);
            expect((_a = result.choices[0]) === null || _a === void 0 ? void 0 : _a.message.content).toBe("Hello World");
        });
        it("should accumulate tool calls", () => {
            var _a, _b, _c, _d, _e, _f;
            const origin = {
                id: "test-id",
                choices: [{
                        index: 0,
                        // @ts-expect-error - finish_reason is not required
                        message: {
                            role: "assistant",
                            content: null,
                            tool_calls: [{
                                    id: "call_1",
                                    type: "function",
                                    function: {
                                        name: "test",
                                        arguments: "{\"arg\": \"value\"}",
                                    },
                                }],
                        },
                    }],
                created: 1234567890,
                model: "gpt-4",
                object: "chat.completion",
            };
            const chunk = {
                id: "test-id",
                // @ts-expect-error - finish_reason is not required
                choices: [{
                        index: 0,
                        delta: {
                            tool_calls: [{
                                    index: 0,
                                    id: "call_1",
                                    function: {
                                        name: "_function",
                                        arguments: "{\"arg2\": \"value2\"}",
                                    },
                                }],
                        },
                    }],
                created: 1234567890,
                model: "gpt-4",
                object: "chat.completion.chunk",
            };
            const result = ChatGptCompletionMessageUtil_1.ChatGptCompletionMessageUtil.accumulate(origin, chunk);
            expect((_c = (_b = (_a = result.choices[0]) === null || _a === void 0 ? void 0 : _a.message.tool_calls) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.function.name).toBe("test_function");
            expect((_f = (_e = (_d = result.choices[0]) === null || _d === void 0 ? void 0 : _d.message.tool_calls) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.function.arguments).toBe("{\"arg\": \"value\"}{\"arg2\": \"value2\"}");
        });
        it("should handle usage aggregation", () => {
            const origin = {
                id: "test-id",
                choices: [{
                        index: 0,
                        // @ts-expect-error - finish_reason is not required
                        message: { role: "assistant", content: "Hello" },
                    }],
                created: 1234567890,
                model: "gpt-4",
                object: "chat.completion",
                usage: {
                    prompt_tokens: 10,
                    completion_tokens: 5,
                    total_tokens: 15,
                },
            };
            const chunk = {
                id: "test-id",
                // @ts-expect-error - finish_reason is not required
                choices: [{
                        index: 0,
                        delta: { content: " World" },
                    }],
                created: 1234567890,
                model: "gpt-4",
                object: "chat.completion.chunk",
                usage: {
                    prompt_tokens: 0,
                    completion_tokens: 6,
                    total_tokens: 6,
                },
            };
            const result = ChatGptCompletionMessageUtil_1.ChatGptCompletionMessageUtil.accumulate(origin, chunk);
            expect(result.usage).toEqual({
                prompt_tokens: 10,
                completion_tokens: 11,
                total_tokens: 21,
                completion_tokens_details: {
                    accepted_prediction_tokens: 0,
                    reasoning_tokens: 0,
                    rejected_prediction_tokens: 0,
                },
                prompt_tokens_details: {
                    audio_tokens: 0,
                    cached_tokens: 0,
                },
            });
        });
    });
    describe("merge", () => {
        it("should merge multiple chunks into completion", () => {
            var _a;
            const chunks = [
                {
                    id: "test-id",
                    // @ts-expect-error - finish_reason is not required
                    choices: [{
                            index: 0,
                            delta: { content: "Hello" },
                        }],
                    created: 1234567890,
                    model: "gpt-4",
                    object: "chat.completion.chunk",
                },
                {
                    id: "test-id",
                    // @ts-expect-error - finish_reason is not required
                    choices: [{
                            index: 0,
                            delta: { content: " World" },
                        }],
                    created: 1234567890,
                    model: "gpt-4",
                    object: "chat.completion.chunk",
                },
            ];
            const result = ChatGptCompletionMessageUtil_1.ChatGptCompletionMessageUtil.merge(chunks);
            expect((_a = result.choices[0]) === null || _a === void 0 ? void 0 : _a.message.content).toBe("Hello World");
        });
        it("should throw error for empty chunks array", () => {
            expect(() => {
                ChatGptCompletionMessageUtil_1.ChatGptCompletionMessageUtil.merge([]);
            }).toThrow("No chunks received");
        });
    });
    describe("mergeChoice", () => {
        it("should merge finish reason", () => {
            const acc = {
                index: 0,
                // @ts-expect-error - finish_reason is not required
                message: { role: "assistant", content: "Hello" },
            };
            const cur = {
                index: 0,
                delta: {},
                finish_reason: "stop",
            };
            const result = ChatGptCompletionMessageUtil_1.ChatGptCompletionMessageUtil.mergeChoice(acc, cur);
            expect(result.finish_reason).toBe("stop");
        });
        it("should merge content", () => {
            const acc = {
                index: 0,
                // @ts-expect-error - refusal is not required
                message: { role: "assistant", content: "Hello" },
            };
            // @ts-expect-error - finish_reason is not required
            const cur = {
                index: 0,
                delta: { content: " World" },
            };
            const result = ChatGptCompletionMessageUtil_1.ChatGptCompletionMessageUtil.mergeChoice(acc, cur);
            expect(result.message.content).toBe("Hello World");
        });
        it("should merge refusal", () => {
            // @ts-expect-error - finish_reason is not required
            const acc = {
                index: 0,
                message: { role: "assistant", content: null, refusal: "I cannot" },
            };
            // @ts-expect-error - finish_reason is not required
            const cur = {
                index: 0,
                delta: { refusal: " do that" },
            };
            const result = ChatGptCompletionMessageUtil_1.ChatGptCompletionMessageUtil.mergeChoice(acc, cur);
            expect(result.message.refusal).toBe("I cannot do that");
        });
    });
    describe("mergeToolCalls", () => {
        it("should merge tool call function arguments", () => {
            const acc = {
                id: "call_1",
                type: "function",
                function: {
                    name: "test",
                    arguments: "{\"arg\": \"value\"}",
                },
            };
            const cur = {
                index: 0,
                id: "call_1",
                function: {
                    arguments: "{\"arg2\": \"value2\"}",
                },
            };
            const result = ChatGptCompletionMessageUtil_1.ChatGptCompletionMessageUtil.mergeToolCalls(acc, cur);
            expect(result.function.arguments).toBe("{\"arg\": \"value\"}{\"arg2\": \"value2\"}");
        });
        it("should merge tool call function name", () => {
            const acc = {
                id: "call_1",
                type: "function",
                function: {
                    name: "test",
                    arguments: "",
                },
            };
            const cur = {
                index: 0,
                id: "call_1",
                function: {
                    name: "_function",
                },
            };
            const result = ChatGptCompletionMessageUtil_1.ChatGptCompletionMessageUtil.mergeToolCalls(acc, cur);
            expect(result.function.name).toBe("test_function");
        });
    });
});
//# sourceMappingURL=ChatGptCompletionMessageUtil.spec.js.map