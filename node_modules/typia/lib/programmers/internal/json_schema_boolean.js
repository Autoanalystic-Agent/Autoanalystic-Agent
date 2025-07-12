"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.json_schema_boolean = void 0;
const json_schema_plugin_1 = require("./json_schema_plugin");
const json_schema_boolean = (atomic) => (0, json_schema_plugin_1.json_schema_plugin)({
    schema: {
        type: "boolean",
    },
    tags: atomic.tags,
});
exports.json_schema_boolean = json_schema_boolean;
//# sourceMappingURL=json_schema_boolean.js.map