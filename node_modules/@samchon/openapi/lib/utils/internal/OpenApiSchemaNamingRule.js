"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenApiSchemaNamingRule = void 0;
const OpenApiTypeChecker_1 = require("../OpenApiTypeChecker");
var OpenApiSchemaNamingRule;
(function (OpenApiSchemaNamingRule) {
    OpenApiSchemaNamingRule.getName = (schema, union = false) => {
        var _a;
        // COALESCE
        if (OpenApiTypeChecker_1.OpenApiTypeChecker.isUnknown(schema))
            return "unknown";
        else if (OpenApiTypeChecker_1.OpenApiTypeChecker.isNull(schema))
            return "null";
        else if (OpenApiTypeChecker_1.OpenApiTypeChecker.isOneOf(schema))
            return schema.oneOf.map((child) => OpenApiSchemaNamingRule.getName(child, true)).join(" | ");
        // ATOMICS
        else if (OpenApiTypeChecker_1.OpenApiTypeChecker.isConstant(schema))
            return JSON.stringify(schema.const);
        else if (OpenApiTypeChecker_1.OpenApiTypeChecker.isBoolean(schema))
            return "boolean";
        else if (OpenApiTypeChecker_1.OpenApiTypeChecker.isInteger(schema))
            return joinIntersection(getNameOfInteger(schema), union);
        else if (OpenApiTypeChecker_1.OpenApiTypeChecker.isNumber(schema))
            return joinIntersection(getNameOfNumber(schema), union);
        else if (OpenApiTypeChecker_1.OpenApiTypeChecker.isString(schema))
            return joinIntersection(getNameOfString(schema), union);
        // INSTANCES
        else if (OpenApiTypeChecker_1.OpenApiTypeChecker.isReference(schema))
            return (_a = schema.$ref.split("/").pop()) !== null && _a !== void 0 ? _a : "unknown";
        else if (OpenApiTypeChecker_1.OpenApiTypeChecker.isObject(schema))
            return "__object";
        else if (OpenApiTypeChecker_1.OpenApiTypeChecker.isArray(schema))
            return joinIntersection(getNameOfArray(schema), union);
        else if (OpenApiTypeChecker_1.OpenApiTypeChecker.isTuple(schema))
            return getNameOfTuple(schema);
        return "unknown";
    };
    const getNameOfInteger = (schema) => [
        "number",
        ...(schema.minimum !== undefined
            ? [
                schema.exclusiveMinimum
                    ? `tags.ExclusiveMinimum<${schema.minimum}>`
                    : `tags.Minimum<${schema.minimum}>`,
            ]
            : []),
        ...(schema.maximum !== undefined
            ? [
                schema.exclusiveMaximum
                    ? `tags.ExclusiveMaximum<${schema.maximum}>`
                    : `tags.Maximum<${schema.maximum}>`,
            ]
            : []),
        ...(schema.multipleOf !== undefined
            ? [`tags.MultipleOf<${schema.multipleOf}>`]
            : []),
    ];
    const getNameOfNumber = (schema) => [
        "number",
        ...(schema.minimum !== undefined
            ? [
                schema.exclusiveMinimum
                    ? `tags.ExclusiveMinimum<${schema.minimum}>`
                    : `tags.Minimum<${schema.minimum}>`,
            ]
            : []),
        ...(schema.maximum !== undefined
            ? [
                schema.exclusiveMaximum
                    ? `tags.ExclusiveMaximum<${schema.maximum}>`
                    : `tags.Maximum<${schema.maximum}>`,
            ]
            : []),
        ...(schema.multipleOf !== undefined
            ? [`tags.MultipleOf<${schema.multipleOf}>`]
            : []),
    ];
    const getNameOfString = (schema) => [
        "string",
        ...(schema.format !== undefined
            ? [`tags.Format<${JSON.stringify(schema.format)}>`]
            : []),
        ...(schema.pattern !== undefined && schema.format === undefined
            ? [`tags.Pattern<${JSON.stringify(schema.pattern)}>`]
            : []),
        ...(schema.contentMediaType !== undefined
            ? [`tags.ContentMediaType<${JSON.stringify(schema.contentMediaType)}>`]
            : []),
        ...(schema.minLength !== undefined
            ? [`tags.MinLength<${schema.minLength}>`]
            : []),
        ...(schema.maxLength !== undefined
            ? [`tags.MaxLength<${schema.maxLength}>`]
            : []),
    ];
    const getNameOfArray = (schema) => [
        `Array<${OpenApiSchemaNamingRule.getName(schema.items)}>`,
        ...(schema.minItems !== undefined
            ? [`tags.MinItems<${schema.minItems}>`]
            : []),
        ...(schema.maxItems !== undefined
            ? [`tags.MaxItems<${schema.maxItems}>`]
            : []),
        ...(schema.uniqueItems !== undefined ? [`tags.UniqueItems`] : []),
    ];
    const getNameOfTuple = (schema) => "[" +
        [
            ...schema.prefixItems.map((child) => OpenApiSchemaNamingRule.getName(child)),
            ...(schema.additionalItems === true
                ? ["...Array<unknown>"]
                : typeof schema.additionalItems === "object" &&
                    schema.additionalItems !== null
                    ? [`...Array<${OpenApiSchemaNamingRule.getName(schema.additionalItems)}>`]
                    : []),
        ].join(", ") +
        "]";
    const joinIntersection = (elements, union) => {
        const str = elements.join(" & ");
        return union ? `(${str})` : str;
    };
})(OpenApiSchemaNamingRule || (exports.OpenApiSchemaNamingRule = OpenApiSchemaNamingRule = {}));
