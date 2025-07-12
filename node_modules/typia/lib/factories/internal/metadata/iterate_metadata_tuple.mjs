import { MetadataTuple } from '../../../schemas/metadata/MetadataTuple.mjs';
import { ArrayUtil } from '../../../utils/ArrayUtil.mjs';
import { emplace_metadata_tuple } from './emplace_metadata_tuple.mjs';

const iterate_metadata_tuple = (props) => {
    if (!props.checker.isTupleType(props.type))
        return false;
    const tupleType = emplace_metadata_tuple(props);
    ArrayUtil.add(props.metadata.tuples, MetadataTuple.create({
        type: tupleType,
        tags: [],
    }), (elem) => elem.type.name === tupleType.name);
    return true;
};

export { iterate_metadata_tuple };
//# sourceMappingURL=iterate_metadata_tuple.mjs.map
