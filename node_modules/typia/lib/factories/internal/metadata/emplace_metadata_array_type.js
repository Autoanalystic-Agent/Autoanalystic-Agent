"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emplace_metadata_array_type = void 0;
const ArrayUtil_1 = require("../../../utils/ArrayUtil");
const explore_metadata_1 = require("./explore_metadata");
const emplace_metadata_array_type = (props) => {
    // CHECK EXISTENCE
    const [array, newbie, setValue] = props.collection.emplaceArray(props.checker, props.type);
    ArrayUtil_1.ArrayUtil.add(array.nullables, props.metadata.nullable);
    if (newbie === false)
        return array;
    // CONSTRUCT VALUE TYPE
    const value = (0, explore_metadata_1.explore_metadata)(Object.assign(Object.assign({}, props), { type: props.array.getNumberIndexType(), explore: Object.assign(Object.assign({}, props.explore), { escaped: false, aliased: false }), intersected: false }));
    setValue(value);
    return array;
};
exports.emplace_metadata_array_type = emplace_metadata_array_type;
//# sourceMappingURL=emplace_metadata_array_type.js.map