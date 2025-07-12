"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenApiV3 = void 0;
/**
 * OpenAPI 3.0 definition.
 *
 * @author Jeongho Nam - https://github.com/samchon
 */
var OpenApiV3;
(function (OpenApiV3) {
    /** @internal */
    OpenApiV3.is = (input) => typeof input === "object" &&
        input !== null &&
        typeof input.openapi === "string" &&
        input.openapi.startsWith("3.0");
})(OpenApiV3 || (exports.OpenApiV3 = OpenApiV3 = {}));
