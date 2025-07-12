import { AssertProgrammer } from '../../programmers/AssertProgrammer.mjs';
import { GenericTransformer } from '../internal/GenericTransformer.mjs';

var CreateAssertTransformer;
(function (CreateAssertTransformer) {
    CreateAssertTransformer.transform = (config) => (props) => GenericTransformer.factory({
        ...props,
        method: config.equals
            ? config.guard
                ? "assertGuardEquals"
                : "assertEquals"
            : config.guard
                ? "assertGuard"
                : "assert",
        write: (x) => AssertProgrammer.write({
            ...x,
            config,
        }),
    });
})(CreateAssertTransformer || (CreateAssertTransformer = {}));

export { CreateAssertTransformer };
//# sourceMappingURL=CreateAssertTransformer.mjs.map
