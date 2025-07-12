"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.iterate_metadata_template = void 0;
const typescript_1 = __importDefault(require("typescript"));
const MetadataTemplate_1 = require("../../../schemas/metadata/MetadataTemplate");
const MetadataHelper_1 = require("./MetadataHelper");
const explore_metadata_1 = require("./explore_metadata");
const iterate_metadata_template = (props) => {
    const filter = (flag) => (props.type.getFlags() & flag) !== 0;
    if (!filter(typescript_1.default.TypeFlags.TemplateLiteral))
        return false;
    const template = props.type;
    const row = [];
    template.texts.forEach((text, i) => {
        // TEXT LITERAL TYPE
        if (text !== "")
            row.push(MetadataHelper_1.MetadataHelper.literal_to_metadata(text));
        // BINDED TEMPLATE TYPE
        const binded = template.types[i];
        if (binded)
            row.push((0, explore_metadata_1.explore_metadata)(Object.assign(Object.assign({}, props), { type: binded, explore: Object.assign(Object.assign({}, props.explore), { escaped: false, aliased: false }), intersected: false })));
    });
    props.metadata.templates.push(MetadataTemplate_1.MetadataTemplate.create({ row, tags: [] }));
    return true;
};
exports.iterate_metadata_template = iterate_metadata_template;
//# sourceMappingURL=iterate_metadata_template.js.map