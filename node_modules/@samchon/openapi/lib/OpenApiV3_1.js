"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenApiV3_1 = void 0;
/**
 * OpenAPI v3.1 definition.
 *
 * @author Jeongho Nam - https://github.com/samchon
 */
var OpenApiV3_1;
(function (OpenApiV3_1) {
    /** @internal */
    OpenApiV3_1.is = (input) => typeof input === "object" &&
        input !== null &&
        typeof input.openapi === "string" &&
        input.openapi.startsWith("3.1");
})(OpenApiV3_1 || (exports.OpenApiV3_1 = OpenApiV3_1 = {}));
