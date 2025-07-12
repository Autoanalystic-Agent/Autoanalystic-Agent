import { MiscAssertPruneProgrammer } from '../../../programmers/misc/MiscAssertPruneProgrammer.mjs';
import { GenericTransformer } from '../../internal/GenericTransformer.mjs';

var MiscCreateAssertPruneTransformer;
(function (MiscCreateAssertPruneTransformer) {
    MiscCreateAssertPruneTransformer.transform = (props) => GenericTransformer.factory({
        ...props,
        method: "misc.createAssertPrune",
        write: MiscAssertPruneProgrammer.write,
    });
})(MiscCreateAssertPruneTransformer || (MiscCreateAssertPruneTransformer = {}));

export { MiscCreateAssertPruneTransformer };
//# sourceMappingURL=MiscCreateAssertPruneTransformer.mjs.map
