import { MiscValidatePruneProgrammer } from '../../../programmers/misc/MiscValidatePruneProgrammer.mjs';
import { GenericTransformer } from '../../internal/GenericTransformer.mjs';

var MiscCreateValidatePruneTransformer;
(function (MiscCreateValidatePruneTransformer) {
    MiscCreateValidatePruneTransformer.transform = (props) => GenericTransformer.factory({
        ...props,
        method: "misc.createValidatePrune",
        write: MiscValidatePruneProgrammer.write,
    });
})(MiscCreateValidatePruneTransformer || (MiscCreateValidatePruneTransformer = {}));

export { MiscCreateValidatePruneTransformer };
//# sourceMappingURL=MiscCreateValidatePruneTransformer.mjs.map
