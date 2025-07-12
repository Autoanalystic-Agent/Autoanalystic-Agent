"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.json_schema_native = void 0;
const json_schema_plugin_1 = require("./json_schema_plugin");
const json_schema_native = (props) => {
    var _a, _b, _c;
    var _d, _e, _f;
    if (props.native.name === "Blob" || props.native.name === "File")
        return (0, json_schema_plugin_1.json_schema_plugin)({
            schema: {
                type: "string",
                format: "binary",
            },
            tags: props.native.tags,
        });
    if (((_a = props.components.schemas) === null || _a === void 0 ? void 0 : _a[props.native.name]) === undefined) {
        (_b = (_d = props.components).schemas) !== null && _b !== void 0 ? _b : (_d.schemas = {});
        (_c = (_e = props.components.schemas)[_f = props.native.name]) !== null && _c !== void 0 ? _c : (_e[_f] = {
            type: "object",
            properties: {},
            required: [],
        });
    }
    return (0, json_schema_plugin_1.json_schema_plugin)({
        schema: {
            $ref: `#/components/schemas/${props.native.name}`,
        },
        tags: props.native.tags,
    });
};
exports.json_schema_native = json_schema_native;
//# sourceMappingURL=json_schema_native.js.map