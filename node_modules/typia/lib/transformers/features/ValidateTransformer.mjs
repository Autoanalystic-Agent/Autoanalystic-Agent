import { ValidateProgrammer } from '../../programmers/ValidateProgrammer.mjs';
import { GenericTransformer } from '../internal/GenericTransformer.mjs';

var ValidateTransformer;
(function (ValidateTransformer) {
    ValidateTransformer.transform = (config) => (props) => GenericTransformer.scalar({
        ...props,
        method: config.equals ? "validateEquals" : "validate",
        write: (x) => ValidateProgrammer.write({
            ...x,
            config,
        }),
    });
})(ValidateTransformer || (ValidateTransformer = {}));

export { ValidateTransformer };
//# sourceMappingURL=ValidateTransformer.mjs.map
