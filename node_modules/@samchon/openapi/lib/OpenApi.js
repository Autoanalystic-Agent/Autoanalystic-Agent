"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenApi = void 0;
const OpenApiV3_2 = require("./OpenApiV3");
const OpenApiV3_1_1 = require("./OpenApiV3_1");
const SwaggerV2_1 = require("./SwaggerV2");
const OpenApiV3Downgrader_1 = require("./converters/OpenApiV3Downgrader");
const OpenApiV3Upgrader_1 = require("./converters/OpenApiV3Upgrader");
const OpenApiV3_1Emender_1 = require("./converters/OpenApiV3_1Emender");
const SwaggerV2Downgrader_1 = require("./converters/SwaggerV2Downgrader");
const SwaggerV2Upgrader_1 = require("./converters/SwaggerV2Upgrader");
/**
 * Emended OpenAPI v3.1 definition used by `typia` and `nestia`.
 *
 * `OpenApi` is a namespace containing functions and interfaces for emended
 * OpenAPI v3.1 specification. The keyword "emended" means that `OpenApi` is not
 * a direct OpenAPI v3.1 specification ({@link OpenApiV3_1}), but a little bit
 * shrunk to remove ambiguous and duplicated expressions of OpenAPI v3.1 for the
 * convenience of `typia` and `nestia`.
 *
 * For example, when representing nullable type, OpenAPI v3.1 supports three
 * ways. In that case, `OpenApi` remains only the third way, so that makes
 * `typia` and `nestia` (especially `@nestia/editor`) to be simple and easy to
 * implement.
 *
 * 1. `{ type: ["string", "null"] }`
 * 2. `{ type: "string", nullable: true }`
 * 3. `{ oneOf: [{ type: "string" }, { type: "null" }] }`
 *
 * Here is the entire list of differences between OpenAPI v3.1 and emended
 * `OpenApi`.
 *
 * - Operation
 *
 *   - Merge {@link OpenApiV3_1.IPath.parameters} to
 *       {@link OpenApi.IOperation.parameters}
 *   - Resolve {@link OpenApi.IJsonSchema.IReference references} of
 *       {@link OpenApiV3_1.IOperation} members
 *   - Escape references of {@link OpenApiV3_1.IComponents.examples}
 * - JSON Schema
 *
 *   - Decompose mixed type: {@link OpenApiV3_1.IJsonSchema.IMixed}
 *   - Resolve nullable property:
 *       {@link OpenApiV3_1.IJsonSchema.__ISignificant.nullable}
 *   - Array type utilizes only single {@link OpenApi.IJsonSchema.IArray.items}
 *   - Tuple type utilizes only {@link OpenApi.IJsonSchema.ITuple.prefixItems}
 *   - Merge {@link OpenApiV3_1.IJsonSchema.IAllOf} to
 *       {@link OpenApi.IJsonSchema.IObject}
 *   - Merge {@link OpenApiV3_1.IJsonSchema.IAnyOf} to
 *       {@link OpenApi.IJsonSchema.IOneOf}
 *   - Merge {@link OpenApiV3_1.IJsonSchema.IRecursiveReference} to
 *       {@link OpenApi.IJsonSchema.IReference}
 *
 * @author Jeongho Nam - https://github.com/samchon
 */
var OpenApi;
(function (OpenApi) {
    /**
     * Convert Swagger or OpenAPI document into emended OpenAPI v3.1 document.
     *
     * @param input Swagger or OpenAPI document to convert
     * @returns Emended OpenAPI v3.1 document
     */
    function convert(input) {
        if (OpenApiV3_1_1.OpenApiV3_1.is(input))
            return OpenApiV3_1Emender_1.OpenApiV3_1Emender.convert(input);
        else if (OpenApiV3_2.OpenApiV3.is(input))
            return OpenApiV3Upgrader_1.OpenApiV3Upgrader.convert(input);
        else if (SwaggerV2_1.SwaggerV2.is(input))
            return SwaggerV2Upgrader_1.SwaggerV2Upgrader.convert(input);
        throw new TypeError("Unrecognized Swagger/OpenAPI version.");
    }
    OpenApi.convert = convert;
    /** @internal */
    function downgrade(document, version) {
        if (version === "2.0")
            return SwaggerV2Downgrader_1.SwaggerV2Downgrader.downgrade(document);
        else if (version === "3.0")
            return OpenApiV3Downgrader_1.OpenApiV3Downgrader.downgrade(document);
        throw new TypeError("Unrecognized Swagger/OpenAPI version.");
    }
    OpenApi.downgrade = downgrade;
})(OpenApi || (exports.OpenApi = OpenApi = {}));
