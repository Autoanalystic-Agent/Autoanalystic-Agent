import { IsProgrammer } from '../../programmers/IsProgrammer.mjs';
import { GenericTransformer } from '../internal/GenericTransformer.mjs';

var CreateIsTransformer;
(function (CreateIsTransformer) {
    CreateIsTransformer.transform = (config) => (props) => GenericTransformer.factory({
        ...props,
        method: config.equals ? "equals" : "is",
        write: (x) => IsProgrammer.write({
            ...x,
            config,
        }),
    });
})(CreateIsTransformer || (CreateIsTransformer = {}));

export { CreateIsTransformer };
//# sourceMappingURL=CreateIsTransformer.mjs.map
