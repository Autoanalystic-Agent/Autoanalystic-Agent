import { iterate_metadata } from './iterate_metadata.mjs';

const iterate_metadata_union = (props) => {
    if (!props.type.isUnion())
        return false;
    props.type.types.forEach((t) => iterate_metadata({
        ...props,
        type: t,
        explore: {
            ...props.explore,
            aliased: false,
        },
    }));
    return true;
};

export { iterate_metadata_union };
//# sourceMappingURL=iterate_metadata_union.mjs.map
