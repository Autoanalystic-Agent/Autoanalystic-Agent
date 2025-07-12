"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenApiExclusiveEmender = void 0;
var OpenApiExclusiveEmender;
(function (OpenApiExclusiveEmender) {
    OpenApiExclusiveEmender.emend = (schema) => {
        const minimum = typeof schema.minimum === "number" &&
            typeof schema.exclusiveMinimum === "number"
            ? {
                minimum: schema.minimum > schema.exclusiveMinimum
                    ? schema.minimum
                    : undefined,
                exclusiveMinimum: schema.minimum > schema.exclusiveMinimum
                    ? undefined
                    : schema.exclusiveMinimum,
            }
            : {};
        const maximum = typeof schema.maximum === "number" &&
            typeof schema.exclusiveMaximum === "number"
            ? {
                maximum: schema.maximum < schema.exclusiveMaximum
                    ? schema.maximum
                    : undefined,
                exclusiveMaximum: schema.maximum < schema.exclusiveMaximum
                    ? undefined
                    : schema.exclusiveMaximum,
            }
            : {};
        return Object.assign(Object.assign(Object.assign({}, schema), minimum), maximum);
    };
})(OpenApiExclusiveEmender || (exports.OpenApiExclusiveEmender = OpenApiExclusiveEmender = {}));
