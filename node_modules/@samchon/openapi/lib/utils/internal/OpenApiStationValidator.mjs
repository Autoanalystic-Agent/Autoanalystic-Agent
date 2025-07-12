import { OpenApiTypeChecker } from "../OpenApiTypeChecker.mjs";

import { OpenApiArrayValidator } from "./OpenApiArrayValidator.mjs";

import { OpenApiBooleanValidator } from "./OpenApiBooleanValidator.mjs";

import { OpenApiConstantValidator } from "./OpenApiConstantValidator.mjs";

import { OpenApiIntegerValidator } from "./OpenApiIntegerValidator.mjs";

import { OpenApiNumberValidator } from "./OpenApiNumberValidator.mjs";

import { OpenApiObjectValidator } from "./OpenApiObjectValidator.mjs";

import { OpenApiOneOfValidator } from "./OpenApiOneOfValidator.mjs";

import { OpenApiSchemaNamingRule } from "./OpenApiSchemaNamingRule.mjs";

import { OpenApiStringValidator } from "./OpenApiStringValidator.mjs";

import { OpenApiTupleValidator } from "./OpenApiTupleValidator.mjs";

var OpenApiStationValidator;

(function(OpenApiStationValidator) {
    OpenApiStationValidator.validate = (ctx, expected) => {
        expected ?? (expected = (() => {
            const name = OpenApiSchemaNamingRule.getName(ctx.schema);
            return ctx.required ? name : `${name} | undefined`;
        })());
        if (OpenApiTypeChecker.isUnknown(ctx.schema)) return true; else if (ctx.value === undefined) return ctx.required === false || ctx.report({
            ...ctx,
            expected
        }); else if (OpenApiTypeChecker.isNull(ctx.schema)) return ctx.value === null || ctx.report({
            ...ctx,
            expected
        }); else if (OpenApiTypeChecker.isReference(ctx.schema)) {
            const schema = ctx.components.schemas?.[ctx.schema.$ref.split("/").pop() ?? ""];
            if (schema === undefined) return true;
            return OpenApiStationValidator.validate({
                ...ctx,
                schema
            }, expected);
        } else if (OpenApiTypeChecker.isOneOf(ctx.schema)) return OpenApiOneOfValidator.validate({
            ...ctx,
            schema: ctx.schema,
            expected
        }); else if (OpenApiTypeChecker.isConstant(ctx.schema)) return OpenApiConstantValidator.validate({
            ...ctx,
            schema: ctx.schema,
            expected
        }); else if (OpenApiTypeChecker.isBoolean(ctx.schema)) return OpenApiBooleanValidator.validate({
            ...ctx,
            schema: ctx.schema,
            expected
        }); else if (OpenApiTypeChecker.isInteger(ctx.schema)) return OpenApiIntegerValidator.validate({
            ...ctx,
            schema: ctx.schema,
            expected
        }); else if (OpenApiTypeChecker.isNumber(ctx.schema)) return OpenApiNumberValidator.validate({
            ...ctx,
            schema: ctx.schema,
            expected
        }); else if (OpenApiTypeChecker.isString(ctx.schema)) return OpenApiStringValidator.validate({
            ...ctx,
            schema: ctx.schema,
            expected
        }); else if (OpenApiTypeChecker.isArray(ctx.schema)) return OpenApiArrayValidator.validate({
            ...ctx,
            schema: ctx.schema,
            expected
        }); else if (OpenApiTypeChecker.isTuple(ctx.schema)) return OpenApiTupleValidator.validate({
            ...ctx,
            schema: ctx.schema,
            expected
        }); else if (OpenApiTypeChecker.isObject(ctx.schema)) return OpenApiObjectValidator.validate({
            ...ctx,
            schema: ctx.schema,
            expected
        });
        return true;
    };
})(OpenApiStationValidator || (OpenApiStationValidator = {}));

export { OpenApiStationValidator };
//# sourceMappingURL=OpenApiStationValidator.mjs.map
