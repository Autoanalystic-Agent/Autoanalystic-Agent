import { NotationIsGeneralProgrammer } from '../../../programmers/notations/NotationIsGeneralProgrammer.mjs';
import { StringUtil } from '../../../utils/StringUtil.mjs';
import { GenericTransformer } from '../../internal/GenericTransformer.mjs';

var NotationCreateIsGeneralTransformer;
(function (NotationCreateIsGeneralTransformer) {
    NotationCreateIsGeneralTransformer.transform = (rename) => (props) => GenericTransformer.factory({
        ...props,
        method: `notations.createIs${StringUtil.capitalize(rename.name)}`,
        write: (x) => NotationIsGeneralProgrammer.write({
            ...x,
            rename,
        }),
    });
})(NotationCreateIsGeneralTransformer || (NotationCreateIsGeneralTransformer = {}));

export { NotationCreateIsGeneralTransformer };
//# sourceMappingURL=NotationCreateIsGeneralTransformer.mjs.map
