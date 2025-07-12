"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOperationSelection = createOperationSelection;
function createOperationSelection(props) {
    return {
        operation: props.operation,
        reason: props.reason,
        toJSON: () => ({
            operation: props.operation.toJSON(),
            reason: props.reason,
        }),
    };
}
//# sourceMappingURL=operations.js.map