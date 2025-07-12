import { Metadata } from '../../../schemas/metadata/Metadata.mjs';
import { emend_metadata_atomics } from './emend_metadata_atomics.mjs';
import { iterate_metadata } from './iterate_metadata.mjs';

const explore_metadata = (props) => {
    // CONSTRUCT METADATA
    const metadata = Metadata.initialize(props.explore.escaped);
    if (props.type === null)
        return metadata;
    // ITERATE TYPESCRIPT TYPES
    props.intersected ??= false;
    iterate_metadata({
        ...props,
        metadata,
        type: props.type,
    });
    emend_metadata_atomics(metadata);
    if (metadata.escaped) {
        emend_metadata_atomics(metadata.escaped.original);
        emend_metadata_atomics(metadata.escaped.returns);
    }
    return metadata;
};

export { explore_metadata };
//# sourceMappingURL=explore_metadata.mjs.map
