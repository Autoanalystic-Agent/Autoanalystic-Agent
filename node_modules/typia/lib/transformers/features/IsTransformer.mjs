import { IsProgrammer } from '../../programmers/IsProgrammer.mjs';
import { GenericTransformer } from '../internal/GenericTransformer.mjs';

var IsTransformer;
(function (IsTransformer) {
    IsTransformer.transform = (config) => (props) => GenericTransformer.scalar({
        ...props,
        method: config.equals ? "equals" : "is",
        write: (x) => IsProgrammer.write({
            ...x,
            config,
        }),
    });
})(IsTransformer || (IsTransformer = {}));

export { IsTransformer };
//# sourceMappingURL=IsTransformer.mjs.map
