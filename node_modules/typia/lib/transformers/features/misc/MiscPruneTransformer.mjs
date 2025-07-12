import { MiscPruneProgrammer } from '../../../programmers/misc/MiscPruneProgrammer.mjs';
import { GenericTransformer } from '../../internal/GenericTransformer.mjs';

var MiscPruneTransformer;
(function (MiscPruneTransformer) {
    MiscPruneTransformer.transform = (props) => GenericTransformer.scalar({
        ...props,
        method: "misc.prune",
        write: MiscPruneProgrammer.write,
    });
})(MiscPruneTransformer || (MiscPruneTransformer = {}));

export { MiscPruneTransformer };
//# sourceMappingURL=MiscPruneTransformer.mjs.map
