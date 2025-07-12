import { TypeFactory } from '../../TypeFactory.mjs';
import { iterate_metadata_alias } from './iterate_metadata_alias.mjs';
import { iterate_metadata_array } from './iterate_metadata_array.mjs';
import { iterate_metadata_atomic } from './iterate_metadata_atomic.mjs';
import { iterate_metadata_coalesce } from './iterate_metadata_coalesce.mjs';
import { iterate_metadata_constant } from './iterate_metadata_constant.mjs';
import { iterate_metadata_escape } from './iterate_metadata_escape.mjs';
import { iterate_metadata_function } from './iterate_metadata_function.mjs';
import { iterate_metadata_intersection } from './iterate_metadata_intersection.mjs';
import { iterate_metadata_map } from './iterate_metadata_map.mjs';
import { iterate_metadata_native } from './iterate_metadata_native.mjs';
import { iterate_metadata_object } from './iterate_metadata_object.mjs';
import { iterate_metadata_set } from './iterate_metadata_set.mjs';
import { iterate_metadata_template } from './iterate_metadata_template.mjs';
import { iterate_metadata_tuple } from './iterate_metadata_tuple.mjs';
import { iterate_metadata_union } from './iterate_metadata_union.mjs';

const iterate_metadata = (props) => {
    if (props.type.isTypeParameter() === true) {
        props.errors.push({
            name: TypeFactory.getFullName({
                checker: props.checker,
                type: props.type,
            }),
            explore: { ...props.explore },
            messages: ["non-specified generic argument found."],
        });
        return;
    }
    // CHECK SPECIAL CASES
    if ((props.explore.aliased !== true && iterate_metadata_alias(props)) ||
        iterate_metadata_intersection(props) ||
        iterate_metadata_union(props) ||
        iterate_metadata_escape(props))
        return;
    // ITERATE CASES
    iterate_metadata_coalesce(props) ||
        iterate_metadata_function(props) ||
        iterate_metadata_constant(props) ||
        iterate_metadata_template(props) ||
        iterate_metadata_atomic(props) ||
        iterate_metadata_tuple(props) ||
        iterate_metadata_array(props) ||
        iterate_metadata_native(props) ||
        iterate_metadata_map(props) ||
        iterate_metadata_set(props) ||
        iterate_metadata_object(props);
};

export { iterate_metadata };
//# sourceMappingURL=iterate_metadata.mjs.map
