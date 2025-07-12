import { NotationGeneralProgrammer } from '../../../programmers/notations/NotationGeneralProgrammer.mjs';
import { StringUtil } from '../../../utils/StringUtil.mjs';
import { GenericTransformer } from '../../internal/GenericTransformer.mjs';

var NotationCreateGeneralTransformer;
(function (NotationCreateGeneralTransformer) {
    NotationCreateGeneralTransformer.transform = (rename) => (props) => GenericTransformer.factory({
        ...props,
        method: `notations.create${StringUtil.capitalize(rename.name)}`,
        write: (x) => NotationGeneralProgrammer.write({
            ...x,
            rename,
        }),
    });
})(NotationCreateGeneralTransformer || (NotationCreateGeneralTransformer = {}));

export { NotationCreateGeneralTransformer };
//# sourceMappingURL=NotationCreateGeneralTransformer.mjs.map
