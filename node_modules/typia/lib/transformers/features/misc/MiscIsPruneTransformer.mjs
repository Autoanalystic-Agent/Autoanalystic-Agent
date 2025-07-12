import { MiscIsPruneProgrammer } from '../../../programmers/misc/MiscIsPruneProgrammer.mjs';
import { GenericTransformer } from '../../internal/GenericTransformer.mjs';

var MiscIsPruneTransformer;
(function (MiscIsPruneTransformer) {
    MiscIsPruneTransformer.transform = (props) => GenericTransformer.scalar({
        ...props,
        method: "misc.isPrune",
        write: MiscIsPruneProgrammer.write,
    });
})(MiscIsPruneTransformer || (MiscIsPruneTransformer = {}));

export { MiscIsPruneTransformer };
//# sourceMappingURL=MiscIsPruneTransformer.mjs.map
