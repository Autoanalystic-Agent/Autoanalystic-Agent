import { MiscValidateCloneProgrammer } from '../../../programmers/misc/MiscValidateCloneProgrammer.mjs';
import { GenericTransformer } from '../../internal/GenericTransformer.mjs';

var MiscValidateCloneTransformer;
(function (MiscValidateCloneTransformer) {
    MiscValidateCloneTransformer.transform = (props) => GenericTransformer.scalar({
        ...props,
        method: "misc.validateClone",
        write: MiscValidateCloneProgrammer.write,
    });
})(MiscValidateCloneTransformer || (MiscValidateCloneTransformer = {}));

export { MiscValidateCloneTransformer };
//# sourceMappingURL=MiscValidateCloneTransformer.mjs.map
