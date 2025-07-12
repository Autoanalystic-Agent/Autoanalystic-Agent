import { NotationValidateGeneralProgrammer } from '../../../programmers/notations/NotationValidateGeneralProgrammer.mjs';
import { StringUtil } from '../../../utils/StringUtil.mjs';
import { GenericTransformer } from '../../internal/GenericTransformer.mjs';

var NotationCreateValidateGeneralTransformer;
(function (NotationCreateValidateGeneralTransformer) {
    NotationCreateValidateGeneralTransformer.transform = (rename) => (props) => GenericTransformer.factory({
        ...props,
        method: `notations.createValidate${StringUtil.capitalize(rename.name)}`,
        write: (x) => NotationValidateGeneralProgrammer.write({
            ...x,
            rename,
        }),
    });
})(NotationCreateValidateGeneralTransformer || (NotationCreateValidateGeneralTransformer = {}));

export { NotationCreateValidateGeneralTransformer };
//# sourceMappingURL=NotationCreateValidateGeneralTransformer.mjs.map
