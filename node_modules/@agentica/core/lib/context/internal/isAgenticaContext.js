"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAgenticaContext = isAgenticaContext;
/**
 * @internal
 */
function isAgenticaContext(ctx) {
    return typeof ctx.initialize === "function";
}
//# sourceMappingURL=isAgenticaContext.js.map