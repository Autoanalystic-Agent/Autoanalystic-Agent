var OpenApiV3_1;

(function(OpenApiV3_1) {
    OpenApiV3_1.is = input => typeof input === "object" && input !== null && typeof input.openapi === "string" && input.openapi.startsWith("3.1");
})(OpenApiV3_1 || (OpenApiV3_1 = {}));

export { OpenApiV3_1 };
//# sourceMappingURL=OpenApiV3_1.mjs.map
