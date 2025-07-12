"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iterate_metadata_array = void 0;
const MetadataArray_1 = require("../../../schemas/metadata/MetadataArray");
const ArrayUtil_1 = require("../../../utils/ArrayUtil");
const emplace_metadata_array_type_1 = require("./emplace_metadata_array_type");
const iterate_metadata_array = (props) => {
    const array = props.checker.isArrayType(props.type) === false
        ? find_array_extended({
            checker: props.checker,
            memory: new Map(),
            type: props.type,
        })
        : props.type;
    if (array === null)
        return false;
    const arrayType = (0, emplace_metadata_array_type_1.emplace_metadata_array_type)(Object.assign(Object.assign({}, props), { array }));
    ArrayUtil_1.ArrayUtil.add(props.metadata.arrays, MetadataArray_1.MetadataArray.create({
        type: arrayType,
        tags: [],
    }), (elem) => elem.type.name === arrayType.name);
    return true;
};
exports.iterate_metadata_array = iterate_metadata_array;
const find_array_extended = (props) => {
    const cached = props.memory.get(props.type);
    if (cached !== undefined)
        return null;
    props.memory.set(props.type, null);
    const res = (() => {
        var _a;
        if (props.type.isClassOrInterface() === false)
            return null;
        for (const t of (_a = props.type.resolvedBaseTypes) !== null && _a !== void 0 ? _a : [])
            if (props.checker.isArrayType(t))
                return t;
            else {
                const res = find_array_extended(Object.assign(Object.assign({}, props), { type: t }));
                if (res !== null)
                    return res;
            }
        return null;
    })();
    props.memory.set(props.type, res);
    return res;
};
//# sourceMappingURL=iterate_metadata_array.js.map