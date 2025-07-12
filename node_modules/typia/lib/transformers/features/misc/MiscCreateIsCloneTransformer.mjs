import { MiscIsCloneProgrammer } from '../../../programmers/misc/MiscIsCloneProgrammer.mjs';
import { GenericTransformer } from '../../internal/GenericTransformer.mjs';

var MiscCreateIsCloneTransformer;
(function (MiscCreateIsCloneTransformer) {
    MiscCreateIsCloneTransformer.transform = (props) => GenericTransformer.factory({
        ...props,
        method: "misc.createIsClone",
        write: MiscIsCloneProgrammer.write,
    });
})(MiscCreateIsCloneTransformer || (MiscCreateIsCloneTransformer = {}));

export { MiscCreateIsCloneTransformer };
//# sourceMappingURL=MiscCreateIsCloneTransformer.mjs.map
