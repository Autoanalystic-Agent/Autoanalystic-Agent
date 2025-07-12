import { MiscValidateCloneProgrammer } from '../../../programmers/misc/MiscValidateCloneProgrammer.mjs';
import { GenericTransformer } from '../../internal/GenericTransformer.mjs';

var MiscCreateValidateCloneTransformer;
(function (MiscCreateValidateCloneTransformer) {
    MiscCreateValidateCloneTransformer.transform = (props) => GenericTransformer.factory({
        ...props,
        method: "misc.createValidateClone",
        write: MiscValidateCloneProgrammer.write,
    });
})(MiscCreateValidateCloneTransformer || (MiscCreateValidateCloneTransformer = {}));

export { MiscCreateValidateCloneTransformer };
//# sourceMappingURL=MiscCreateValidateCloneTransformer.mjs.map
