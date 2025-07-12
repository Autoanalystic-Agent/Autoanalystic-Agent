import ts from 'typescript';
import { MetadataAtomic } from '../../../schemas/metadata/MetadataAtomic.mjs';
import { ArrayUtil } from '../../../utils/ArrayUtil.mjs';

const same = (type) => {
    if (type === null)
        return () => false;
    return (flag) => (type.getFlags() & flag) !== 0;
};
const iterate_metadata_atomic = (props) => {
    // PREPARE INTERNAL FUNCTIONS
    const filter = same(props.type);
    const check = (info) => {
        if (filter(info.atomic) || filter(info.literal)) {
            ArrayUtil.add(props.metadata.atomics, MetadataAtomic.create({ type: info.name, tags: [] }), (x, y) => x.type === y.type);
            return true;
        }
        return false;
    };
    // CHECK EACH TYPES
    return ATOMICS.some((info) => check(info));
};
const ATOMICS = [
    {
        name: "boolean",
        atomic: ts.TypeFlags.BooleanLike,
        literal: ts.TypeFlags.BooleanLiteral,
    },
    {
        name: "number",
        atomic: ts.TypeFlags.NumberLike,
        literal: ts.TypeFlags.NumberLiteral,
    },
    {
        name: "bigint",
        atomic: ts.TypeFlags.BigInt,
        literal: ts.TypeFlags.BigIntLiteral,
    },
    {
        name: "string",
        atomic: ts.TypeFlags.StringLike,
        literal: ts.TypeFlags.StringLiteral,
    },
];

export { iterate_metadata_atomic };
//# sourceMappingURL=iterate_metadata_atomic.mjs.map
