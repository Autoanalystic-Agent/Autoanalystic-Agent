import { MiscCloneProgrammer } from '../../../programmers/misc/MiscCloneProgrammer.mjs';
import { GenericTransformer } from '../../internal/GenericTransformer.mjs';

var MiscCloneTransformer;
(function (MiscCloneTransformer) {
    MiscCloneTransformer.transform = (props) => GenericTransformer.scalar({
        ...props,
        method: "misc.clone",
        write: MiscCloneProgrammer.write,
    });
})(MiscCloneTransformer || (MiscCloneTransformer = {}));

export { MiscCloneTransformer };
//# sourceMappingURL=MiscCloneTransformer.mjs.map
