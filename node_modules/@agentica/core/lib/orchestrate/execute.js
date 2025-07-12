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
exports.execute = execute;
const call_1 = require("./call");
const cancel_1 = require("./cancel");
const describe_1 = require("./describe");
const initialize_1 = require("./initialize");
const select_1 = require("./select");
function execute(executor) {
    return (ctx) => __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        // FUNCTIONS ARE NOT LISTED YET
        if (ctx.ready() === false) {
            if ((executor === null || executor === void 0 ? void 0 : executor.initialize) !== true && typeof (executor === null || executor === void 0 ? void 0 : executor.initialize) !== "function") {
                yield ctx.initialize();
            }
            else {
                yield (typeof (executor === null || executor === void 0 ? void 0 : executor.initialize) === "function"
                    ? executor.initialize
                    : initialize_1.initialize)(ctx);
                if (ctx.ready() === false) {
                    return;
                }
            }
        }
        // CANCEL CANDIDATE FUNCTIONS
        if (ctx.stack.length !== 0) {
            yield ((_a = executor === null || executor === void 0 ? void 0 : executor.cancel) !== null && _a !== void 0 ? _a : cancel_1.cancel)(ctx);
        }
        // SELECT CANDIDATE FUNCTIONS
        yield ((_b = executor === null || executor === void 0 ? void 0 : executor.select) !== null && _b !== void 0 ? _b : select_1.select)(ctx);
        if (ctx.stack.length === 0) {
            return;
        }
        // FUNCTION CALLING LOOP
        while (true) {
            // EXECUTE FUNCTIONS
            const executes = yield ((_c = executor === null || executor === void 0 ? void 0 : executor.call) !== null && _c !== void 0 ? _c : call_1.call)(ctx, ctx.stack.map(s => s.operation));
            // EXPLAIN RETURN VALUES
            if ((executor === null || executor === void 0 ? void 0 : executor.describe) !== null && (executor === null || executor === void 0 ? void 0 : executor.describe) !== false) {
                yield (typeof (executor === null || executor === void 0 ? void 0 : executor.describe) === "function"
                    ? executor.describe
                    : describe_1.describe)(ctx, executes);
            }
            if (executes.length === 0 || ctx.stack.length === 0) {
                break;
            }
        }
    });
}
//# sourceMappingURL=execute.js.map