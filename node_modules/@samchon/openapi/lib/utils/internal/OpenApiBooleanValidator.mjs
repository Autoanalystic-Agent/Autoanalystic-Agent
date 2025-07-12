var OpenApiBooleanValidator;

(function(OpenApiBooleanValidator) {
    OpenApiBooleanValidator.validate = ctx => typeof ctx.value === "boolean" || ctx.report(ctx);
})(OpenApiBooleanValidator || (OpenApiBooleanValidator = {}));

export { OpenApiBooleanValidator };
//# sourceMappingURL=OpenApiBooleanValidator.mjs.map
