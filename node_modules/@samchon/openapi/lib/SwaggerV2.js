"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwaggerV2 = void 0;
/**
 * Swagger v2.0 definition.
 *
 * @author Jeongho Nam - https://github.com/samchon
 */
var SwaggerV2;
(function (SwaggerV2) {
    /** @internal */
    SwaggerV2.is = (input) => typeof input === "object" &&
        input !== null &&
        typeof input.swagger === "string" &&
        input.swagger.startsWith("2.0");
})(SwaggerV2 || (exports.SwaggerV2 = SwaggerV2 = {}));
