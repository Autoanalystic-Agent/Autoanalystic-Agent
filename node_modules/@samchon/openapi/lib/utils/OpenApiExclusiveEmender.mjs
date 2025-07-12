var OpenApiExclusiveEmender;

(function(OpenApiExclusiveEmender) {
    OpenApiExclusiveEmender.emend = schema => {
        const minimum = typeof schema.minimum === "number" && typeof schema.exclusiveMinimum === "number" ? {
            minimum: schema.minimum > schema.exclusiveMinimum ? schema.minimum : undefined,
            exclusiveMinimum: schema.minimum > schema.exclusiveMinimum ? undefined : schema.exclusiveMinimum
        } : {};
        const maximum = typeof schema.maximum === "number" && typeof schema.exclusiveMaximum === "number" ? {
            maximum: schema.maximum < schema.exclusiveMaximum ? schema.maximum : undefined,
            exclusiveMaximum: schema.maximum < schema.exclusiveMaximum ? undefined : schema.exclusiveMaximum
        } : {};
        return {
            ...schema,
            ...minimum,
            ...maximum
        };
    };
})(OpenApiExclusiveEmender || (OpenApiExclusiveEmender = {}));

export { OpenApiExclusiveEmender };
//# sourceMappingURL=OpenApiExclusiveEmender.mjs.map
