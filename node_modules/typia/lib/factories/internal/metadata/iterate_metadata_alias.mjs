import { MetadataAlias } from '../../../schemas/metadata/MetadataAlias.mjs';
import { ArrayUtil } from '../../../utils/ArrayUtil.mjs';
import { emplace_metadata_alias } from './emplace_metadata_alias.mjs';

const iterate_metadata_alias = (props) => {
    if (props.options.absorb !== false || props.type.aliasSymbol === undefined)
        return false;
    const node = props.type.aliasSymbol.declarations?.[0];
    if (node === undefined)
        return false;
    // CONSTRUCT DEFINITION
    const type = emplace_metadata_alias(props);
    ArrayUtil.take(props.metadata.aliases, (elem) => elem.type.name === type.name, () => MetadataAlias.create({
        type,
        tags: [],
    }));
    return true;
};

export { iterate_metadata_alias };
//# sourceMappingURL=iterate_metadata_alias.mjs.map
