import { NotationIsGeneralProgrammer } from '../../../programmers/notations/NotationIsGeneralProgrammer.mjs';
import { StringUtil } from '../../../utils/StringUtil.mjs';
import { GenericTransformer } from '../../internal/GenericTransformer.mjs';

var NotationIsGeneralTransformer;
(function (NotationIsGeneralTransformer) {
    NotationIsGeneralTransformer.transform = (rename) => (props) => GenericTransformer.scalar({
        ...props,
        method: `notations.is${StringUtil.capitalize(rename.name)}`,
        write: (x) => NotationIsGeneralProgrammer.write({
            ...x,
            rename,
        }),
    });
})(NotationIsGeneralTransformer || (NotationIsGeneralTransformer = {}));

export { NotationIsGeneralTransformer };
//# sourceMappingURL=NotationIsGeneralTransformer.mjs.map
