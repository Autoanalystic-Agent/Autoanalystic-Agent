"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emplace_metadata_alias = void 0;
const ArrayUtil_1 = require("../../../utils/ArrayUtil");
const explore_metadata_1 = require("./explore_metadata");
const emplace_metadata_alias = (props) => {
    // CHECK EXISTENCE
    const [alias, newbie, closure] = props.collection.emplaceAlias(props.checker, props.type, props.type.aliasSymbol);
    ArrayUtil_1.ArrayUtil.add(alias.nullables, props.metadata.nullable);
    if (newbie === false)
        return alias;
    // CONSTRUCT VALUE TYPE
    const value = (0, explore_metadata_1.explore_metadata)(Object.assign(Object.assign({}, props), { explore: Object.assign(Object.assign({}, props.explore), { escaped: false, aliased: true }), intersected: false }));
    closure(value);
    return alias;
};
exports.emplace_metadata_alias = emplace_metadata_alias;
//# sourceMappingURL=emplace_metadata_alias.js.map