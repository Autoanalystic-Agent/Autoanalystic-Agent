import { MiscPruneProgrammer } from '../../../programmers/misc/MiscPruneProgrammer.mjs';
import { GenericTransformer } from '../../internal/GenericTransformer.mjs';

var MiscCreatePruneTransformer;
(function (MiscCreatePruneTransformer) {
    MiscCreatePruneTransformer.transform = (props) => GenericTransformer.factory({
        ...props,
        method: "misc.createPrune",
        write: MiscPruneProgrammer.write,
    });
})(MiscCreatePruneTransformer || (MiscCreatePruneTransformer = {}));

export { MiscCreatePruneTransformer };
//# sourceMappingURL=MiscCreatePruneTransformer.mjs.map
