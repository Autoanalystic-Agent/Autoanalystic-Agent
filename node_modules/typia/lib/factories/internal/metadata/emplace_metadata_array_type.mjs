import { ArrayUtil } from '../../../utils/ArrayUtil.mjs';
import { explore_metadata } from './explore_metadata.mjs';

const emplace_metadata_array_type = (props) => {
    // CHECK EXISTENCE
    const [array, newbie, setValue] = props.collection.emplaceArray(props.checker, props.type);
    ArrayUtil.add(array.nullables, props.metadata.nullable);
    if (newbie === false)
        return array;
    // CONSTRUCT VALUE TYPE
    const value = explore_metadata({
        ...props,
        type: props.array.getNumberIndexType(),
        explore: {
            ...props.explore,
            escaped: false,
            aliased: false,
        },
        intersected: false,
    });
    setValue(value);
    return array;
};

export { emplace_metadata_array_type };
//# sourceMappingURL=emplace_metadata_array_type.mjs.map
