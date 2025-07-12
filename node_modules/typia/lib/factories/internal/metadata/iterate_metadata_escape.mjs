import { Metadata } from '../../../schemas/metadata/Metadata.mjs';
import { MetadataEscaped } from '../../../schemas/metadata/MetadataEscaped.mjs';
import { Writable } from '../../../typings/Writable.mjs';
import { TypeFactory } from '../../TypeFactory.mjs';
import { iterate_metadata } from './iterate_metadata.mjs';

const iterate_metadata_escape = (props) => {
    if (props.options.escape === false || props.explore.escaped === true)
        return false;
    const escaped = TypeFactory.getReturnTypeOfClassMethod({
        checker: props.checker,
        class: props.type,
        function: "toJSON",
    });
    if (escaped === null)
        return false;
    if (props.metadata.escaped === null) {
        Writable(props.metadata).escaped = MetadataEscaped.create({
            original: Metadata.initialize(),
            returns: Metadata.initialize(),
        });
    }
    iterate_metadata({
        ...props,
        metadata: props.metadata.escaped.original,
        explore: {
            ...props.explore,
            escaped: true,
        },
    });
    iterate_metadata({
        ...props,
        metadata: props.metadata.escaped.returns,
        type: escaped,
        explore: {
            ...props.explore,
            escaped: true,
        },
    });
    return true;
};

export { iterate_metadata_escape };
//# sourceMappingURL=iterate_metadata_escape.mjs.map
