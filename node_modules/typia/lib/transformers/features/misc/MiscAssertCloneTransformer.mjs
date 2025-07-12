import { MiscAssertCloneProgrammer } from '../../../programmers/misc/MiscAssertCloneProgrammer.mjs';
import { GenericTransformer } from '../../internal/GenericTransformer.mjs';

var MiscAssertCloneTransformer;
(function (MiscAssertCloneTransformer) {
    MiscAssertCloneTransformer.transform = (props) => GenericTransformer.scalar({
        ...props,
        method: "misc.assertClone",
        write: MiscAssertCloneProgrammer.write,
    });
})(MiscAssertCloneTransformer || (MiscAssertCloneTransformer = {}));

export { MiscAssertCloneTransformer };
//# sourceMappingURL=MiscAssertCloneTransformer.mjs.map
