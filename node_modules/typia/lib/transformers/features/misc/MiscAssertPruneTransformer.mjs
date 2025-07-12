import { MiscAssertPruneProgrammer } from '../../../programmers/misc/MiscAssertPruneProgrammer.mjs';
import { GenericTransformer } from '../../internal/GenericTransformer.mjs';

var MiscAssertPruneTransformer;
(function (MiscAssertPruneTransformer) {
    MiscAssertPruneTransformer.transform = (props) => GenericTransformer.scalar({
        ...props,
        method: "misc.assertPrune",
        write: MiscAssertPruneProgrammer.write,
    });
})(MiscAssertPruneTransformer || (MiscAssertPruneTransformer = {}));

export { MiscAssertPruneTransformer };
//# sourceMappingURL=MiscAssertPruneTransformer.mjs.map
