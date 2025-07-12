import ts from 'typescript';
import { Writable } from '../../../typings/Writable.mjs';

const iterate_metadata_coalesce = (props) => {
    const filter = (flag) => (props.type.getFlags() & flag) !== 0;
    if (filter(ts.TypeFlags.Unknown) || filter(ts.TypeFlags.Any)) {
        Writable(props.metadata).any = true;
        return true;
    }
    else if (filter(ts.TypeFlags.Null)) {
        Writable(props.metadata).nullable = true;
        return true;
    }
    else if (filter(ts.TypeFlags.Undefined) ||
        filter(ts.TypeFlags.Never) ||
        filter(ts.TypeFlags.Void) ||
        filter(ts.TypeFlags.VoidLike)) {
        Writable(props.metadata).required = false;
        return true;
    }
    return false;
};

export { iterate_metadata_coalesce };
//# sourceMappingURL=iterate_metadata_coalesce.mjs.map
