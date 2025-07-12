"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iterate_metadata_tuple = void 0;
const MetadataTuple_1 = require("../../../schemas/metadata/MetadataTuple");
const ArrayUtil_1 = require("../../../utils/ArrayUtil");
const emplace_metadata_tuple_1 = require("./emplace_metadata_tuple");
const iterate_metadata_tuple = (props) => {
    if (!props.checker.isTupleType(props.type))
        return false;
    const tupleType = (0, emplace_metadata_tuple_1.emplace_metadata_tuple)(props);
    ArrayUtil_1.ArrayUtil.add(props.metadata.tuples, MetadataTuple_1.MetadataTuple.create({
        type: tupleType,
        tags: [],
    }), (elem) => elem.type.name === tupleType.name);
    return true;
};
exports.iterate_metadata_tuple = iterate_metadata_tuple;
//# sourceMappingURL=iterate_metadata_tuple.js.map