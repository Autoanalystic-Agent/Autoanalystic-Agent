"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iterate_metadata_alias = void 0;
const MetadataAlias_1 = require("../../../schemas/metadata/MetadataAlias");
const ArrayUtil_1 = require("../../../utils/ArrayUtil");
const emplace_metadata_alias_1 = require("./emplace_metadata_alias");
const iterate_metadata_alias = (props) => {
    var _a;
    if (props.options.absorb !== false || props.type.aliasSymbol === undefined)
        return false;
    const node = (_a = props.type.aliasSymbol.declarations) === null || _a === void 0 ? void 0 : _a[0];
    if (node === undefined)
        return false;
    // CONSTRUCT DEFINITION
    const type = (0, emplace_metadata_alias_1.emplace_metadata_alias)(props);
    ArrayUtil_1.ArrayUtil.take(props.metadata.aliases, (elem) => elem.type.name === type.name, () => MetadataAlias_1.MetadataAlias.create({
        type,
        tags: [],
    }));
    return true;
};
exports.iterate_metadata_alias = iterate_metadata_alias;
//# sourceMappingURL=iterate_metadata_alias.js.map