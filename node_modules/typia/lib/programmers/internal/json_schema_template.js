"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.json_schema_templates = void 0;
const Metadata_1 = require("../../schemas/metadata/Metadata");
const json_schema_plugin_1 = require("./json_schema_plugin");
const metadata_to_pattern_1 = require("./metadata_to_pattern");
const json_schema_templates = (metadata) => {
    var _a;
    const pureTemplates = metadata.templates.filter((t) => { var _a; return isPure((_a = t.tags) !== null && _a !== void 0 ? _a : []) === true; });
    const taggedTemplates = metadata.templates.filter((t) => { var _a; return isPure((_a = t.tags) !== null && _a !== void 0 ? _a : []) === false; });
    const output = [];
    if (pureTemplates.length)
        output.push({
            type: "string",
            pattern: (0, metadata_to_pattern_1.metadata_to_pattern)({
                top: true,
                metadata: Metadata_1.Metadata.create(Object.assign(Object.assign({}, Metadata_1.Metadata.initialize()), { templates: pureTemplates })),
            }),
        });
    for (const tpl of taggedTemplates)
        output.push(...(0, json_schema_plugin_1.json_schema_plugin)({
            schema: {
                type: "string",
                pattern: (0, metadata_to_pattern_1.metadata_to_pattern)({
                    top: false,
                    metadata: Metadata_1.Metadata.create(Object.assign(Object.assign({}, Metadata_1.Metadata.initialize()), { templates: [tpl] })),
                }),
            },
            tags: (_a = tpl.tags) !== null && _a !== void 0 ? _a : [],
        }));
    return output;
};
exports.json_schema_templates = json_schema_templates;
const isPure = (matrix) => matrix.every((tags) => filter(tags).length === 0);
const filter = (tags) => tags.filter((t) => t.schema !== undefined);
//# sourceMappingURL=json_schema_template.js.map