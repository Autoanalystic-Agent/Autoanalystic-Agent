var OpenApiV3;

(function(OpenApiV3) {
    OpenApiV3.is = input => typeof input === "object" && input !== null && typeof input.openapi === "string" && input.openapi.startsWith("3.0");
})(OpenApiV3 || (OpenApiV3 = {}));

export { OpenApiV3 };
//# sourceMappingURL=OpenApiV3.mjs.map
