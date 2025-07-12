import { MiscIsCloneProgrammer } from '../../../programmers/misc/MiscIsCloneProgrammer.mjs';
import { GenericTransformer } from '../../internal/GenericTransformer.mjs';

var MiscIsCloneTransformer;
(function (MiscIsCloneTransformer) {
    MiscIsCloneTransformer.transform = (props) => GenericTransformer.scalar({
        ...props,
        method: "misc.isClone",
        write: MiscIsCloneProgrammer.write,
    });
})(MiscIsCloneTransformer || (MiscIsCloneTransformer = {}));

export { MiscIsCloneTransformer };
//# sourceMappingURL=MiscIsCloneTransformer.mjs.map
