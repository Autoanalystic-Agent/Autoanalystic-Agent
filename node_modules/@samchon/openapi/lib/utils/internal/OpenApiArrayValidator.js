"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenApiArrayValidator = void 0;
const _isUniqueItems_1 = require("../../functional/_isUniqueItems");
const OpenApiStationValidator_1 = require("./OpenApiStationValidator");
var OpenApiArrayValidator;
(function (OpenApiArrayValidator) {
    OpenApiArrayValidator.validate = (ctx) => {
        if (Array.isArray(ctx.value) === false)
            return ctx.report(ctx);
        return [
            ctx.value
                .map((value, i) => OpenApiStationValidator_1.OpenApiStationValidator.validate(Object.assign(Object.assign({}, ctx), { schema: ctx.schema.items, value, path: `${ctx.path}[${i}]`, required: true })))
                .every((v) => v),
            ctx.schema.minItems !== undefined
                ? ctx.value.length >= ctx.schema.minItems ||
                    ctx.report(Object.assign(Object.assign({}, ctx), { expected: `Array<> & MinItems<${ctx.schema.minItems}>` }))
                : true,
            ctx.schema.maxItems !== undefined
                ? ctx.value.length <= ctx.schema.maxItems ||
                    ctx.report(Object.assign(Object.assign({}, ctx), { expected: `Array<> & MaxItems<${ctx.schema.maxItems}>` }))
                : true,
            ctx.schema.uniqueItems !== undefined
                ? ctx.schema.uniqueItems
                    ? (0, _isUniqueItems_1._isUniqueItems)(ctx.value) ||
                        ctx.report(Object.assign(Object.assign({}, ctx), { expected: `Array<> & UniqueItems` }))
                    : true
                : true,
        ].every((v) => v);
    };
})(OpenApiArrayValidator || (exports.OpenApiArrayValidator = OpenApiArrayValidator = {}));
