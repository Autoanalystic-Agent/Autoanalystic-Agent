import ts from 'typescript';
import { MetadataObject } from '../../../schemas/metadata/MetadataObject.mjs';
import { ArrayUtil } from '../../../utils/ArrayUtil.mjs';
import { emplace_metadata_object } from './emplace_metadata_object.mjs';

const iterate_metadata_object = (props, ensure = false) => {
    if (ensure === false) {
        const filter = (flag) => (props.type.getFlags() & flag) !== 0;
        if (!filter(ts.TypeFlags.Object) &&
            !props.type.isIntersection() &&
            props.type.intrinsicName !== "object")
            return false;
    }
    const obj = emplace_metadata_object(props);
    ArrayUtil.add(props.metadata.objects, MetadataObject.create({
        type: obj,
        tags: [],
    }), (elem) => elem.type.name === obj.name);
    return true;
};

export { iterate_metadata_object };
//# sourceMappingURL=iterate_metadata_object.mjs.map
