import { MiscValidatePruneProgrammer } from '../../../programmers/misc/MiscValidatePruneProgrammer.mjs';
import { GenericTransformer } from '../../internal/GenericTransformer.mjs';

var MiscValidatePruneTransformer;
(function (MiscValidatePruneTransformer) {
    MiscValidatePruneTransformer.transform = (props) => GenericTransformer.scalar({
        ...props,
        method: "misc.validatePrune",
        write: MiscValidatePruneProgrammer.write,
    });
})(MiscValidatePruneTransformer || (MiscValidatePruneTransformer = {}));

export { MiscValidatePruneTransformer };
//# sourceMappingURL=MiscValidatePruneTransformer.mjs.map
