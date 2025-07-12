"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGptDescribeFunctionAgent = void 0;
exports.describe = describe;
const AgenticaDefaultPrompt_1 = require("../constants/AgenticaDefaultPrompt");
const AgenticaSystemPrompt_1 = require("../constants/AgenticaSystemPrompt");
const events_1 = require("../factory/events");
const histories_1 = require("../factory/histories");
const ChatGptCompletionMessageUtil_1 = require("../utils/ChatGptCompletionMessageUtil");
const MPSC_1 = require("../utils/MPSC");
const StreamUtil_1 = require("../utils/StreamUtil");
function describe(ctx, histories) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        if (histories.length === 0) {
            return;
        }
        const completionStream = yield ctx.request("describe", {
            messages: [
                // COMMON SYSTEM PROMPT
                {
                    role: "system",
                    content: AgenticaDefaultPrompt_1.AgenticaDefaultPrompt.write(ctx.config),
                },
                // FUNCTION CALLING HISTORIES
                ...histories.map(histories_1.decodeHistory).flat(),
                // SYSTEM PROMPT
                {
                    role: "system",
                    content: (_d = (_c = (_b = (_a = ctx.config) === null || _a === void 0 ? void 0 : _a.systemPrompt) === null || _b === void 0 ? void 0 : _b.describe) === null || _c === void 0 ? void 0 : _c.call(_b, histories)) !== null && _d !== void 0 ? _d : AgenticaSystemPrompt_1.AgenticaSystemPrompt.DESCRIBE,
                },
            ],
        });
        const describeContext = [];
        yield StreamUtil_1.StreamUtil.reduce(completionStream, (accPromise, chunk) => __awaiter(this, void 0, void 0, function* () {
            const acc = yield accPromise;
            const registerContext = (choices) => {
                for (const choice of choices) {
                    /**
                     * @TODO fix it
                     * Sometimes, the complete message arrives along with a finish reason.
                     */
                    if (choice.finish_reason != null) {
                        describeContext[choice.index].mpsc.close();
                        continue;
                    }
                    if (choice.delta.content == null) {
                        continue;
                    }
                    if (describeContext[choice.index] != null) {
                        describeContext[choice.index].content += choice.delta.content;
                        describeContext[choice.index].mpsc.produce(choice.delta.content);
                        continue;
                    }
                    const mpsc = new MPSC_1.MPSC();
                    describeContext[choice.index] = {
                        content: choice.delta.content,
                        mpsc,
                    };
                    mpsc.produce(choice.delta.content);
                    const event = (0, events_1.createDescribeEvent)({
                        executes: histories,
                        stream: (0, StreamUtil_1.streamDefaultReaderToAsyncGenerator)(mpsc.consumer.getReader()),
                        done: () => mpsc.done(),
                        get: () => { var _a, _b; return (_b = (_a = describeContext[choice.index]) === null || _a === void 0 ? void 0 : _a.content) !== null && _b !== void 0 ? _b : ""; },
                        join: () => __awaiter(this, void 0, void 0, function* () {
                            yield mpsc.waitClosed();
                            return describeContext[choice.index].content;
                        }),
                    });
                    ctx.dispatch(event);
                }
            };
            if (acc.object === "chat.completion.chunk") {
                registerContext([acc, chunk].flatMap(v => v.choices));
                return ChatGptCompletionMessageUtil_1.ChatGptCompletionMessageUtil.merge([acc, chunk]);
            }
            registerContext(chunk.choices);
            return ChatGptCompletionMessageUtil_1.ChatGptCompletionMessageUtil.accumulate(acc, chunk);
        }));
    });
}
exports.ChatGptDescribeFunctionAgent = {
    execute: describe,
};
//# sourceMappingURL=describe.js.map