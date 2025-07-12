"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.json_schema_string = void 0;
const json_schema_plugin_1 = require("./json_schema_plugin");
const json_schema_string = (atomic) => (0, json_schema_plugin_1.json_schema_plugin)({
    schema: {
        type: "string",
    },
    tags: atomic.tags,
});
exports.json_schema_string = json_schema_string;
//# sourceMappingURL=json_schema_string.js.map