import { NotationGeneralProgrammer } from '../../../programmers/notations/NotationGeneralProgrammer.mjs';
import { GenericTransformer } from '../../internal/GenericTransformer.mjs';

var NotationGeneralTransformer;
(function (NotationGeneralTransformer) {
    NotationGeneralTransformer.transform = (rename) => (props) => GenericTransformer.scalar({
        ...props,
        method: `notations.${rename.name}`,
        write: (x) => NotationGeneralProgrammer.write({
            ...x,
            rename,
        }),
    });
})(NotationGeneralTransformer || (NotationGeneralTransformer = {}));

export { NotationGeneralTransformer };
//# sourceMappingURL=NotationGeneralTransformer.mjs.map
