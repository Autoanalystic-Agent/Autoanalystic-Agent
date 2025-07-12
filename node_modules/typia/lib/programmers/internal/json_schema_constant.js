"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.json_schema_constant = void 0;
const json_schema_description_1 = require("./json_schema_description");
const json_schema_plugin_1 = require("./json_schema_plugin");
const json_schema_title_1 = require("./json_schema_title");
const json_schema_constant = (constant) => constant.values
    .map((value) => {
    var _a;
    return (0, json_schema_plugin_1.json_schema_plugin)({
        schema: {
            const: typeof value.value === "bigint"
                ? Number(value.value)
                : value.value,
            title: (0, json_schema_title_1.json_schema_title)(value),
            description: (0, json_schema_description_1.json_schema_description)(value),
        },
        tags: (_a = value.tags) !== null && _a !== void 0 ? _a : [],
    });
})
    .flat();
exports.json_schema_constant = json_schema_constant;
//# sourceMappingURL=json_schema_constant.js.map