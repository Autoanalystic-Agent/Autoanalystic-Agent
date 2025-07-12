import { ValidateProgrammer } from '../../programmers/ValidateProgrammer.mjs';
import { GenericTransformer } from '../internal/GenericTransformer.mjs';

var CreateValidateTransformer;
(function (CreateValidateTransformer) {
    CreateValidateTransformer.transform = (config) => (props) => GenericTransformer.factory({
        ...props,
        method: config.equals ? "validateEquals" : "validate",
        write: (x) => ValidateProgrammer.write({
            ...x,
            config,
        }),
    });
})(CreateValidateTransformer || (CreateValidateTransformer = {}));

export { CreateValidateTransformer };
//# sourceMappingURL=CreateValidateTransformer.mjs.map
