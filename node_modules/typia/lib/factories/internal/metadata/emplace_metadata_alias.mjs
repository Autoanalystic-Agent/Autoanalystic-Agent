import { ArrayUtil } from '../../../utils/ArrayUtil.mjs';
import { explore_metadata } from './explore_metadata.mjs';

const emplace_metadata_alias = (props) => {
    // CHECK EXISTENCE
    const [alias, newbie, closure] = props.collection.emplaceAlias(props.checker, props.type, props.type.aliasSymbol);
    ArrayUtil.add(alias.nullables, props.metadata.nullable);
    if (newbie === false)
        return alias;
    // CONSTRUCT VALUE TYPE
    const value = explore_metadata({
        ...props,
        explore: {
            ...props.explore,
            escaped: false,
            aliased: true,
        },
        intersected: false,
    });
    closure(value);
    return alias;
};

export { emplace_metadata_alias };
//# sourceMappingURL=emplace_metadata_alias.mjs.map
