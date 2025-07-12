import { AssertProgrammer } from '../../programmers/AssertProgrammer.mjs';
import { GenericTransformer } from '../internal/GenericTransformer.mjs';

var AssertTransformer;
(function (AssertTransformer) {
    AssertTransformer.transform = (config) => (props) => GenericTransformer.scalar({
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
})(AssertTransformer || (AssertTransformer = {}));

export { AssertTransformer };
//# sourceMappingURL=AssertTransformer.mjs.map
