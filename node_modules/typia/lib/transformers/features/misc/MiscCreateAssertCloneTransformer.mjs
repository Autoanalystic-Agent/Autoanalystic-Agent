import { MiscAssertCloneProgrammer } from '../../../programmers/misc/MiscAssertCloneProgrammer.mjs';
import { GenericTransformer } from '../../internal/GenericTransformer.mjs';

var MiscCreateAssertCloneTransformer;
(function (MiscCreateAssertCloneTransformer) {
    MiscCreateAssertCloneTransformer.transform = (props) => GenericTransformer.factory({
        ...props,
        method: "misc.createAssertClone",
        write: MiscAssertCloneProgrammer.write,
    });
})(MiscCreateAssertCloneTransformer || (MiscCreateAssertCloneTransformer = {}));

export { MiscCreateAssertCloneTransformer };
//# sourceMappingURL=MiscCreateAssertCloneTransformer.mjs.map
