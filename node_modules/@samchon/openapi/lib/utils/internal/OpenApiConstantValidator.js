"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenApiConstantValidator = void 0;
var OpenApiConstantValidator;
(function (OpenApiConstantValidator) {
    OpenApiConstantValidator.validate = (ctx) => {
        return ctx.value === ctx.schema.const || ctx.report(ctx);
    };
})(OpenApiConstantValidator || (exports.OpenApiConstantValidator = OpenApiConstantValidator = {}));
