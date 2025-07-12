import { NotationValidateGeneralProgrammer } from '../../../programmers/notations/NotationValidateGeneralProgrammer.mjs';
import { StringUtil } from '../../../utils/StringUtil.mjs';
import { GenericTransformer } from '../../internal/GenericTransformer.mjs';

var NotationValidateGeneralTransformer;
(function (NotationValidateGeneralTransformer) {
    NotationValidateGeneralTransformer.transform = (rename) => (props) => GenericTransformer.scalar({
        ...props,
        method: `notations.validate${StringUtil.capitalize(rename.name)}`,
        write: (x) => NotationValidateGeneralProgrammer.write({
            ...x,
            rename,
        }),
    });
})(NotationValidateGeneralTransformer || (NotationValidateGeneralTransformer = {}));

export { NotationValidateGeneralTransformer };
//# sourceMappingURL=NotationValidateGeneralTransformer.mjs.map
