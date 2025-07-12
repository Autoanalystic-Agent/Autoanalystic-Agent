var SwaggerV2;

(function(SwaggerV2) {
    SwaggerV2.is = input => typeof input === "object" && input !== null && typeof input.swagger === "string" && input.swagger.startsWith("2.0");
})(SwaggerV2 || (SwaggerV2 = {}));

export { SwaggerV2 };
//# sourceMappingURL=SwaggerV2.mjs.map
