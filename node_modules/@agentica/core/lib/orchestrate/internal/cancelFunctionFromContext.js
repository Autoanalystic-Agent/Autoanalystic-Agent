"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelFunctionFromContext = cancelFunctionFromContext;
const events_1 = require("../../factory/events");
const operations_1 = require("../../factory/operations");
/**
 * @internal
 */
function cancelFunctionFromContext(ctx, reference) {
    const index = ctx.stack.findIndex(item => item.operation.name === reference.name);
    if (index === -1) {
        return;
    }
    const item = ctx.stack[index];
    ctx.stack.splice(index, 1);
    const event = (0, events_1.createCancelEvent)({
        selection: (0, operations_1.createOperationSelection)({
            operation: item.operation,
            reason: reference.reason,
        }),
    });
    ctx.dispatch(event);
}
//# sourceMappingURL=cancelFunctionFromContext.js.map