import { MetadataArray } from '../../../schemas/metadata/MetadataArray.mjs';
import { ArrayUtil } from '../../../utils/ArrayUtil.mjs';
import { emplace_metadata_array_type } from './emplace_metadata_array_type.mjs';

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
    const arrayType = emplace_metadata_array_type({
        ...props,
        array,
    });
    ArrayUtil.add(props.metadata.arrays, MetadataArray.create({
        type: arrayType,
        tags: [],
    }), (elem) => elem.type.name === arrayType.name);
    return true;
};
const find_array_extended = (props) => {
    const cached = props.memory.get(props.type);
    if (cached !== undefined)
        return null;
    props.memory.set(props.type, null);
    const res = (() => {
        if (props.type.isClassOrInterface() === false)
            return null;
        for (const t of props.type.resolvedBaseTypes ?? [])
            if (props.checker.isArrayType(t))
                return t;
            else {
                const res = find_array_extended({
                    ...props,
                    type: t,
                });
                if (res !== null)
                    return res;
            }
        return null;
    })();
    props.memory.set(props.type, res);
    return res;
};

export { iterate_metadata_array };
//# sourceMappingURL=iterate_metadata_array.mjs.map
