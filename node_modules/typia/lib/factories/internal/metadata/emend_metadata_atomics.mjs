import { MetadataAtomic } from '../../../schemas/metadata/MetadataAtomic.mjs';
import { ArrayUtil } from '../../../utils/ArrayUtil.mjs';

const emend_metadata_atomics = (meta) => {
    // ATOMICS
    for (const a of meta.atomics) {
        if (is_not_pure(a))
            continue;
        const index = meta.constants.findIndex((c) => c.type === a.type);
        if (index !== -1)
            meta.constants.splice(index, 1);
    }
    // BOOLEAN
    {
        const index = meta.constants.findIndex((c) => c.type === "boolean");
        if (index !== -1 && meta.constants[index].values.length === 2) {
            const temp = meta.constants.splice(index, 1)[0];
            ArrayUtil.take(meta.atomics, (a) => a.type === "boolean", () => MetadataAtomic.create({
                type: "boolean",
                tags: temp.values[0].tags ?? [],
            }));
        }
    }
    // TEMPLATE
    if (meta.templates.length) {
        const atomic = meta.atomics.find((a) => a.type === "string");
        if (atomic !== undefined && false === is_not_pure(atomic))
            meta.templates.splice(0, meta.templates.length);
    }
};
const is_not_pure = (atomic) => atomic.tags.length !== 0 &&
    atomic.tags.every((row) => row.length !== 0 && row.every((c) => !!c.validate?.length));

export { emend_metadata_atomics };
//# sourceMappingURL=emend_metadata_atomics.mjs.map
