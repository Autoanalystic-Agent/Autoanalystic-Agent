import { MiscCloneProgrammer } from '../../../programmers/misc/MiscCloneProgrammer.mjs';
import { GenericTransformer } from '../../internal/GenericTransformer.mjs';

var MiscCreateCloneTransformer;
(function (MiscCreateCloneTransformer) {
    MiscCreateCloneTransformer.transform = (props) => GenericTransformer.factory({
        ...props,
        method: "misc.createClone",
        write: MiscCloneProgrammer.write,
    });
})(MiscCreateCloneTransformer || (MiscCreateCloneTransformer = {}));

export { MiscCreateCloneTransformer };
//# sourceMappingURL=MiscCreateCloneTransformer.mjs.map
