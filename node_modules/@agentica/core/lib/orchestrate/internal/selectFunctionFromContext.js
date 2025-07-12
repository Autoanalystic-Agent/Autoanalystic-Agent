"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectFunctionFromContext = selectFunctionFromContext;
const events_1 = require("../../factory/events");
const operations_1 = require("../../factory/operations");
/**
 * @internal
 */
function selectFunctionFromContext(ctx, reference) {
    const operation = ctx.operations.flat.get(reference.name);
    if (operation === undefined) {
        return;
    }
    const selection = (0, operations_1.createOperationSelection)({
        operation,
        reason: reference.reason,
    });
    ctx.stack.push(selection);
    const event = (0, events_1.createSelectEvent)({
        selection,
    });
    ctx.dispatch(event);
}
//# sourceMappingURL=selectFunctionFromContext.js.map