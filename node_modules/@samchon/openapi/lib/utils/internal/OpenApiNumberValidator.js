"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenApiNumberValidator = void 0;
var OpenApiNumberValidator;
(function (OpenApiNumberValidator) {
    OpenApiNumberValidator.validate = (ctx) => {
        if (typeof ctx.value !== "number")
            return ctx.report(ctx);
        return [
            ctx.schema.minimum !== undefined
                ? ctx.schema.exclusiveMinimum
                    ? ctx.value > ctx.schema.minimum ||
                        ctx.report(Object.assign(Object.assign({}, ctx), { expected: `number & ExclusiveMinimum<${ctx.schema.minimum}>` }))
                    : ctx.value >= ctx.schema.minimum ||
                        ctx.report(Object.assign(Object.assign({}, ctx), { expected: `number & Minimum<${ctx.schema.minimum}>` }))
                : true,
            ctx.schema.maximum !== undefined
                ? ctx.schema.exclusiveMaximum
                    ? ctx.value < ctx.schema.maximum ||
                        ctx.report(Object.assign(Object.assign({}, ctx), { expected: `number & ExclusiveMaximum<${ctx.schema.maximum}>` }))
                    : ctx.value <= ctx.schema.maximum ||
                        ctx.report(Object.assign(Object.assign({}, ctx), { expected: `number & Maximum<${ctx.schema.maximum}>` }))
                : true,
            ctx.schema.multipleOf !== undefined
                ? ctx.value % ctx.schema.multipleOf === 0 ||
                    ctx.report(Object.assign(Object.assign({}, ctx), { expected: `number & MultipleOf<${ctx.schema.multipleOf}>` }))
                : true,
        ].every((v) => v);
    };
})(OpenApiNumberValidator || (exports.OpenApiNumberValidator = OpenApiNumberValidator = {}));
