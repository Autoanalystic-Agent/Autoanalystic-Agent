"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iterate_metadata_union = void 0;
const iterate_metadata_1 = require("./iterate_metadata");
const iterate_metadata_union = (props) => {
    if (!props.type.isUnion())
        return false;
    props.type.types.forEach((t) => (0, iterate_metadata_1.iterate_metadata)(Object.assign(Object.assign({}, props), { type: t, explore: Object.assign(Object.assign({}, props.explore), { aliased: false }) })));
    return true;
};
exports.iterate_metadata_union = iterate_metadata_union;
//# sourceMappingURL=iterate_metadata_union.js.map