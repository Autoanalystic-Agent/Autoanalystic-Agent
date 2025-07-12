"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.json_schema_plugin = void 0;
const json_schema_plugin = (props) => {
    const plugins = props.tags
        .map((row) => row.filter((t) => t.schema !== undefined))
        .filter((row) => row.length !== 0);
    if (plugins.length === 0)
        return [props.schema];
    return plugins.map((row) => {
        const base = Object.assign({}, props.schema);
        for (const tag of row)
            Object.assign(base, tag.schema);
        return base;
    });
};
exports.json_schema_plugin = json_schema_plugin;
//# sourceMappingURL=json_schema_plugin.js.map