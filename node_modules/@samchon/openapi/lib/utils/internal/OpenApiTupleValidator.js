"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenApiTupleValidator = void 0;
const OpenApiStationValidator_1 = require("./OpenApiStationValidator");
var OpenApiTupleValidator;
(function (OpenApiTupleValidator) {
    OpenApiTupleValidator.validate = (ctx) => {
        if (!Array.isArray(ctx.value))
            return ctx.report(ctx);
        else if (!!ctx.schema.additionalItems === false) {
            if (ctx.value.length !== ctx.schema.prefixItems.length)
                return ctx.report(ctx);
            return ctx.value
                .map((v, i) => OpenApiStationValidator_1.OpenApiStationValidator.validate(Object.assign(Object.assign({}, ctx), { schema: ctx.schema.prefixItems[i], value: v, path: `${ctx.path}[${i}]` })))
                .every((v) => v);
        }
        if (ctx.value.length < ctx.schema.prefixItems.length)
            return ctx.report(ctx);
        const next = typeof ctx.schema.additionalItems === "object" &&
            ctx.schema.additionalItems !== null
            ? (v, i) => OpenApiStationValidator_1.OpenApiStationValidator.validate(Object.assign(Object.assign({}, ctx), { schema: ctx.schema.additionalItems, value: v, path: `${ctx.path}[${i}]` }))
            : () => true;
        return (ctx.value.length >= ctx.schema.prefixItems.length &&
            ctx.value
                .map((v, i) => i < ctx.schema.prefixItems.length
                ? OpenApiStationValidator_1.OpenApiStationValidator.validate(Object.assign(Object.assign({}, ctx), { schema: ctx.schema.prefixItems[i], value: v, path: `${ctx.path}[${i}]` }))
                : next(v, i))
                .every((v) => v));
    };
})(OpenApiTupleValidator || (exports.OpenApiTupleValidator = OpenApiTupleValidator = {}));
