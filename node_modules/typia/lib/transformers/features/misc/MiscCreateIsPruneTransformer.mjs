import { MiscIsPruneProgrammer } from '../../../programmers/misc/MiscIsPruneProgrammer.mjs';
import { GenericTransformer } from '../../internal/GenericTransformer.mjs';

var MiscCreateIsPruneTransformer;
(function (MiscCreateIsPruneTransformer) {
    MiscCreateIsPruneTransformer.transform = (props) => GenericTransformer.factory({
        ...props,
        method: "misc.createIsPrune",
        write: MiscIsPruneProgrammer.write,
    });
})(MiscCreateIsPruneTransformer || (MiscCreateIsPruneTransformer = {}));

export { MiscCreateIsPruneTransformer };
//# sourceMappingURL=MiscCreateIsPruneTransformer.mjs.map
