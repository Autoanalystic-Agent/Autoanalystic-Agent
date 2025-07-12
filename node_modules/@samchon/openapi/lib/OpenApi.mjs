import { OpenApiV3 } from "./OpenApiV3.mjs";

import { OpenApiV3_1 } from "./OpenApiV3_1.mjs";

import { SwaggerV2 } from "./SwaggerV2.mjs";

import { OpenApiV3Downgrader } from "./converters/OpenApiV3Downgrader.mjs";

import { OpenApiV3Upgrader } from "./converters/OpenApiV3Upgrader.mjs";

import { OpenApiV3_1Emender } from "./converters/OpenApiV3_1Emender.mjs";

import { SwaggerV2Downgrader } from "./converters/SwaggerV2Downgrader.mjs";

import { SwaggerV2Upgrader } from "./converters/SwaggerV2Upgrader.mjs";

var OpenApi;

(function(OpenApi) {
    function convert(input) {
        if (OpenApiV3_1.is(input)) return OpenApiV3_1Emender.convert(input); else if (OpenApiV3.is(input)) return OpenApiV3Upgrader.convert(input); else if (SwaggerV2.is(input)) return SwaggerV2Upgrader.convert(input);
        throw new TypeError("Unrecognized Swagger/OpenAPI version.");
    }
    OpenApi.convert = convert;
    function downgrade(document, version) {
        if (version === "2.0") return SwaggerV2Downgrader.downgrade(document); else if (version === "3.0") return OpenApiV3Downgrader.downgrade(document);
        throw new TypeError("Unrecognized Swagger/OpenAPI version.");
    }
    OpenApi.downgrade = downgrade;
})(OpenApi || (OpenApi = {}));

export { OpenApi };
//# sourceMappingURL=OpenApi.mjs.map
