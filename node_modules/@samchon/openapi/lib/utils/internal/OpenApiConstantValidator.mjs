var OpenApiConstantValidator;

(function(OpenApiConstantValidator) {
    OpenApiConstantValidator.validate = ctx => ctx.value === ctx.schema.const || ctx.report(ctx);
})(OpenApiConstantValidator || (OpenApiConstantValidator = {}));

export { OpenApiConstantValidator };
//# sourceMappingURL=OpenApiConstantValidator.mjs.map
