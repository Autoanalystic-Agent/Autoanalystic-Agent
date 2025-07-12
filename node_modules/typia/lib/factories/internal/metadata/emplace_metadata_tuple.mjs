import ts from 'typescript';
import { Metadata } from '../../../schemas/metadata/Metadata.mjs';
import { Writable } from '../../../typings/Writable.mjs';
import { ArrayUtil } from '../../../utils/ArrayUtil.mjs';
import { explore_metadata } from './explore_metadata.mjs';

const emplace_metadata_tuple = (props) => {
    // CHECK EXISTENCE
    const [tuple, newbie, closure] = props.collection.emplaceTuple(props.checker, props.type);
    ArrayUtil.add(tuple.nullables, props.metadata.nullable);
    if (newbie === false)
        return tuple;
    // CONSTRUCT ELEMENT TYPES
    const flagList = props.type.elementFlags ??
        props.type.target?.elementFlags ??
        [];
    const elements = props.checker
        .getTypeArguments(props.type)
        .map((elem, i) => {
        const child = explore_metadata({
            ...props,
            type: elem,
            explore: {
                ...props.explore,
                nested: tuple,
                aliased: false,
                escaped: false,
            },
            intersected: false,
        });
        // CHECK OPTIONAL
        const flag = flagList[i];
        if (flag === ts.ElementFlags.Optional)
            Writable(child).optional = true;
        // REST TYPE
        if (flag !== ts.ElementFlags.Rest)
            return child;
        const wrapper = Metadata.initialize();
        Writable(wrapper).rest = child;
        return wrapper;
    });
    closure(elements);
    return tuple;
};

export { emplace_metadata_tuple };
//# sourceMappingURL=emplace_metadata_tuple.mjs.map
