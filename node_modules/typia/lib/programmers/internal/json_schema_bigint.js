"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.json_schema_bigint = void 0;
const json_schema_plugin_1 = require("./json_schema_plugin");
const json_schema_bigint = (atomic) => (0, json_schema_plugin_1.json_schema_plugin)({
    schema: {
        type: "integer",
    },
    tags: atomic.tags,
});
exports.json_schema_bigint = json_schema_bigint;
//# sourceMappingURL=json_schema_bigint.js.map