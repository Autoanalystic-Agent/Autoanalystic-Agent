"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformHistory = transformHistory;
const histories_1 = require("../factory/histories");
const operations_1 = require("../factory/operations");
/**
 * @internal
 */
function transformHistory(props) {
    // USER
    if (props.history.type === "userMessage") {
        return transformUserMessage({
            history: props.history,
        });
    }
    // ASSISTANT
    else if (props.history.type === "assistantMessage") {
        return transformAssistantMessage({
            history: props.history,
        });
    }
    // SYSTEM
    else if (props.history.type === "systemMessage") {
        return transformSystemMessage({
            history: props.history,
        });
    }
    // SELECT & CANCEL
    else if (props.history.type === "select") {
        return transformSelect({
            operations: props.operations,
            history: props.history,
        });
    }
    else if (props.history.type === "cancel") {
        return transformCancel({
            operations: props.operations,
            history: props.history,
        });
    }
    // EXECUTE
    else if (props.history.type === "execute") {
        return transformExecute({
            operations: props.operations,
            history: props.history,
        });
    }
    return transformDescribe({
        operations: props.operations,
        history: props.history,
    });
}
function transformAssistantMessage(props) {
    return (0, histories_1.createAssistantMessageHistory)(props.history);
}
function transformSystemMessage(props) {
    return (0, histories_1.createSystemMessageHistory)(props.history);
}
function transformUserMessage(props) {
    return (0, histories_1.createUserMessageHistory)(props.history);
}
function transformSelect(props) {
    return (0, histories_1.createSelectHistory)({
        id: props.history.id,
        created_at: props.history.created_at,
        selection: (0, operations_1.createOperationSelection)({
            operation: findOperation({
                operations: props.operations,
                input: props.history.selection.operation,
            }),
            reason: props.history.selection.reason,
        }),
    });
}
function transformCancel(props) {
    return (0, histories_1.createCancelHistory)({
        id: props.history.id,
        created_at: props.history.created_at,
        selection: (0, operations_1.createOperationSelection)({
            operation: findOperation({
                operations: props.operations,
                input: props.history.selection.operation,
            }),
            reason: props.history.selection.reason,
        }),
    });
}
function transformExecute(props) {
    return (0, histories_1.createExecuteHistory)({
        id: props.history.id,
        created_at: props.history.created_at,
        operation: findOperation({
            operations: props.operations,
            input: props.history.operation,
        }),
        arguments: props.history.arguments,
        /**
         * @TODO fix it
         * The property and value have a type mismatch, but it works.
         */
        value: props.history.value,
    });
}
function transformDescribe(props) {
    return (0, histories_1.createDescribeHistory)({
        id: props.history.id,
        created_at: props.history.created_at,
        text: props.history.text,
        executes: props.history.executes.map(next => transformExecute({
            operations: props.operations,
            history: next,
        })),
    });
}
function findOperation(props) {
    var _a;
    const found = (_a = props.operations
        .get(props.input.controller)) === null || _a === void 0 ? void 0 : _a.get(props.input.function);
    if (found === undefined) {
        throw new Error(`No operation found: (controller: ${props.input.controller}, function: ${props.input.function})`);
    }
    return found;
}
//# sourceMappingURL=transformHistory.js.map