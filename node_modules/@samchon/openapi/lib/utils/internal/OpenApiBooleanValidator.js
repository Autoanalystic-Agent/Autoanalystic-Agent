"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenApiBooleanValidator = void 0;
var OpenApiBooleanValidator;
(function (OpenApiBooleanValidator) {
    OpenApiBooleanValidator.validate = (ctx) => {
        return typeof ctx.value === "boolean" || ctx.report(ctx);
    };
})(OpenApiBooleanValidator || (exports.OpenApiBooleanValidator = OpenApiBooleanValidator = {}));
