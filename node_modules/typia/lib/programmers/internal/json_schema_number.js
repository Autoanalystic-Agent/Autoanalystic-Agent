"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.json_schema_number = void 0;
const json_schema_plugin_1 = require("./json_schema_plugin");
const json_schema_number = (atomic) => (0, json_schema_plugin_1.json_schema_plugin)({
    schema: {
        type: "number",
    },
    tags: atomic.tags,
});
exports.json_schema_number = json_schema_number;
//# sourceMappingURL=json_schema_number.js.map