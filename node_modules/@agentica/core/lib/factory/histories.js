"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeHistory = decodeHistory;
exports.decodeUserMessageContent = decodeUserMessageContent;
exports.createUserMessageHistory = createUserMessageHistory;
exports.createAssistantMessageHistory = createAssistantMessageHistory;
exports.createSystemMessageHistory = createSystemMessageHistory;
exports.createDescribeHistory = createDescribeHistory;
exports.createSelectHistory = createSelectHistory;
exports.createCancelHistory = createCancelHistory;
exports.createExecuteHistory = createExecuteHistory;
/**
 * @internal
 */
function decodeHistory(history) {
    // NO NEED TO DECODE DESCRIBE
    if (history.type === "describe") {
        return [];
    }
    else if (history.type === "select" || history.type === "cancel") {
        return [
            {
                role: "assistant",
                tool_calls: [
                    {
                        type: "function",
                        id: history.id,
                        function: {
                            name: `${history.type}Functions`,
                            arguments: JSON.stringify({
                                function: {
                                    name: history.selection.operation.name,
                                    reason: history.selection.reason,
                                },
                            }),
                        },
                    },
                ],
            },
            {
                role: "tool",
                tool_call_id: history.id,
                content: "",
            },
        ];
    }
    else if (history.type === "execute") {
        return [
            {
                role: "assistant",
                tool_calls: [
                    {
                        type: "function",
                        id: history.id,
                        function: {
                            name: history.operation.name,
                            arguments: JSON.stringify(history.arguments),
                        },
                    },
                ],
            },
            {
                role: "tool",
                tool_call_id: history.id,
                content: JSON.stringify(Object.assign({ function: Object.assign({ protocol: history.operation.protocol, description: history.operation.function.description, parameters: history.operation.function.parameters, output: history.operation.function.output }, (history.operation.protocol === "http"
                        ? {
                            method: history.operation.function.method,
                            path: history.operation.function.path,
                        }
                        : {})) }, (history.operation.protocol === "http"
                    ? {
                        status: history.value.status,
                        data: history.value.body,
                    }
                    : {
                        value: history.value,
                    }))),
            },
        ];
    }
    if (history.type === "assistantMessage") {
        return [
            {
                role: "assistant",
                content: history.text,
            },
        ];
    }
    if (history.type === "systemMessage") {
        return [
            {
                role: "system",
                content: history.text,
            },
        ];
    }
    if (history.type === "userMessage") {
        const contents = history.contents;
        return [
            {
                role: "user",
                content: contents.map(decodeUserMessageContent),
            },
        ];
    }
    history;
    throw new Error(`Unsupported history type, value: ${JSON.stringify(history)}`);
}
/**
 * @internal
 */
function decodeUserMessageContent(content) {
    if (content.type === "text") {
        return content;
    }
    if (content.type === "audio") {
        return {
            type: "input_audio",
            input_audio: {
                data: content.data,
                format: content.format,
            },
        };
    }
    if (content.type === "file") {
        return {
            type: "file",
            file: content.file.type === "data"
                ? {
                    file_data: content.file.data,
                    filename: content.file.name,
                }
                : {
                    file_id: content.file.id,
                },
        };
    }
    if (content.type === "image") {
        return {
            type: "image_url",
            image_url: {
                url: content.url,
                detail: content.detail,
            },
        };
    }
    content;
    throw new Error(`Unsupported user message content type, value: ${JSON.stringify(content)}`);
}
/* -----------------------------------------------------------
  USER INPUT PROMPTS
----------------------------------------------------------- */
/**
 * @internal
 */
function createUserMessageHistory(props) {
    return {
        type: "userMessage",
        id: props.id,
        created_at: props.created_at,
        contents: props.contents,
        toJSON: () => ({
            type: "userMessage",
            id: props.id,
            created_at: props.created_at,
            contents: props.contents,
        }),
    };
}
/* -----------------------------------------------------------
  TEXT PROMPTS
----------------------------------------------------------- */
/**
 * @internal
 */
function createAssistantMessageHistory(props) {
    const prompt = {
        type: "assistantMessage",
        id: props.id,
        created_at: props.created_at,
        text: props.text,
    };
    return Object.assign(Object.assign({}, prompt), { toJSON: () => prompt });
}
/**
 * @internal
 */
function createSystemMessageHistory(props) {
    const prompt = {
        type: "systemMessage",
        id: props.id,
        created_at: props.created_at,
        text: props.text,
    };
    return Object.assign(Object.assign({}, prompt), { toJSON: () => prompt });
}
/**
 * @internal
 */
function createDescribeHistory(props) {
    return {
        type: "describe",
        id: props.id,
        created_at: props.created_at,
        text: props.text,
        executes: props.executes,
        toJSON: () => ({
            type: "describe",
            id: props.id,
            created_at: props.created_at,
            text: props.text,
            executes: props.executes.map(execute => execute.toJSON()),
        }),
    };
}
/* -----------------------------------------------------------
  FUNCTION CALLING PROMPTS
----------------------------------------------------------- */
/**
 * @internal
 */
function createSelectHistory(props) {
    return {
        type: "select",
        id: props.id,
        selection: props.selection,
        created_at: props.created_at,
        toJSON: () => ({
            type: "select",
            id: props.id,
            created_at: props.created_at,
            selection: props.selection.toJSON(),
        }),
    };
}
/**
 * @internal
 */
function createCancelHistory(props) {
    return {
        type: "cancel",
        id: props.id,
        created_at: props.created_at,
        selection: props.selection,
        toJSON: () => ({
            type: "cancel",
            id: props.id,
            created_at: props.created_at,
            selection: props.selection.toJSON(),
        }),
    };
}
/**
 * @internal
 */
function createExecuteHistory(props) {
    return {
        type: "execute",
        protocol: props.operation.protocol,
        id: props.id,
        created_at: props.created_at,
        operation: props.operation,
        arguments: props.arguments,
        value: props.value,
        toJSON: () => ({
            type: "execute",
            id: props.id,
            created_at: props.created_at,
            protocol: props.operation.protocol,
            operation: props.operation.toJSON(),
            arguments: props.arguments,
            value: props.value,
        }),
    };
}
//# sourceMappingURL=histories.js.map