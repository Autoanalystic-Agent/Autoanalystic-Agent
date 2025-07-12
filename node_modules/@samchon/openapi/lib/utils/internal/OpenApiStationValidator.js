"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenApiStationValidator = void 0;
const OpenApiTypeChecker_1 = require("../OpenApiTypeChecker");
const OpenApiArrayValidator_1 = require("./OpenApiArrayValidator");
const OpenApiBooleanValidator_1 = require("./OpenApiBooleanValidator");
const OpenApiConstantValidator_1 = require("./OpenApiConstantValidator");
const OpenApiIntegerValidator_1 = require("./OpenApiIntegerValidator");
const OpenApiNumberValidator_1 = require("./OpenApiNumberValidator");
const OpenApiObjectValidator_1 = require("./OpenApiObjectValidator");
const OpenApiOneOfValidator_1 = require("./OpenApiOneOfValidator");
const OpenApiSchemaNamingRule_1 = require("./OpenApiSchemaNamingRule");
const OpenApiStringValidator_1 = require("./OpenApiStringValidator");
const OpenApiTupleValidator_1 = require("./OpenApiTupleValidator");
var OpenApiStationValidator;
(function (OpenApiStationValidator) {
    OpenApiStationValidator.validate = (ctx, expected) => {
        var _a, _b;
        // THE TYPE NAME
        expected !== null && expected !== void 0 ? expected : (expected = (() => {
            const name = OpenApiSchemaNamingRule_1.OpenApiSchemaNamingRule.getName(ctx.schema);
            return ctx.required ? name : `${name} | undefined`;
        })());
        // COALESCE
        if (OpenApiTypeChecker_1.OpenApiTypeChecker.isUnknown(ctx.schema))
            return true;
        else if (ctx.value === undefined)
            return (ctx.required === false ||
                ctx.report(Object.assign(Object.assign({}, ctx), { expected })));
        else if (OpenApiTypeChecker_1.OpenApiTypeChecker.isNull(ctx.schema))
            return (ctx.value === null ||
                ctx.report(Object.assign(Object.assign({}, ctx), { expected })));
        // NESTED
        else if (OpenApiTypeChecker_1.OpenApiTypeChecker.isReference(ctx.schema)) {
            const schema = (_a = ctx.components.schemas) === null || _a === void 0 ? void 0 : _a[(_b = ctx.schema.$ref.split("/").pop()) !== null && _b !== void 0 ? _b : ""];
            if (schema === undefined)
                return true;
            return OpenApiStationValidator.validate(Object.assign(Object.assign({}, ctx), { schema }), expected);
        }
        else if (OpenApiTypeChecker_1.OpenApiTypeChecker.isOneOf(ctx.schema))
            return OpenApiOneOfValidator_1.OpenApiOneOfValidator.validate(Object.assign(Object.assign({}, ctx), { schema: ctx.schema, expected }));
        // ATOMICS
        else if (OpenApiTypeChecker_1.OpenApiTypeChecker.isConstant(ctx.schema))
            return OpenApiConstantValidator_1.OpenApiConstantValidator.validate(Object.assign(Object.assign({}, ctx), { schema: ctx.schema, expected }));
        else if (OpenApiTypeChecker_1.OpenApiTypeChecker.isBoolean(ctx.schema))
            return OpenApiBooleanValidator_1.OpenApiBooleanValidator.validate(Object.assign(Object.assign({}, ctx), { schema: ctx.schema, expected }));
        else if (OpenApiTypeChecker_1.OpenApiTypeChecker.isInteger(ctx.schema))
            return OpenApiIntegerValidator_1.OpenApiIntegerValidator.validate(Object.assign(Object.assign({}, ctx), { schema: ctx.schema, expected }));
        else if (OpenApiTypeChecker_1.OpenApiTypeChecker.isNumber(ctx.schema))
            return OpenApiNumberValidator_1.OpenApiNumberValidator.validate(Object.assign(Object.assign({}, ctx), { schema: ctx.schema, expected }));
        else if (OpenApiTypeChecker_1.OpenApiTypeChecker.isString(ctx.schema))
            return OpenApiStringValidator_1.OpenApiStringValidator.validate(Object.assign(Object.assign({}, ctx), { schema: ctx.schema, expected }));
        // INSTANCES
        else if (OpenApiTypeChecker_1.OpenApiTypeChecker.isArray(ctx.schema))
            return OpenApiArrayValidator_1.OpenApiArrayValidator.validate(Object.assign(Object.assign({}, ctx), { schema: ctx.schema, expected }));
        else if (OpenApiTypeChecker_1.OpenApiTypeChecker.isTuple(ctx.schema))
            return OpenApiTupleValidator_1.OpenApiTupleValidator.validate(Object.assign(Object.assign({}, ctx), { schema: ctx.schema, expected }));
        else if (OpenApiTypeChecker_1.OpenApiTypeChecker.isObject(ctx.schema))
            return OpenApiObjectValidator_1.OpenApiObjectValidator.validate(Object.assign(Object.assign({}, ctx), { schema: ctx.schema, expected }));
        return true;
    };
})(OpenApiStationValidator || (exports.OpenApiStationValidator = OpenApiStationValidator = {}));
