import { NotationAssertGeneralProgrammer } from '../../../programmers/notations/NotationAssertGeneralProgrammer.mjs';
import { StringUtil } from '../../../utils/StringUtil.mjs';
import { GenericTransformer } from '../../internal/GenericTransformer.mjs';

var NotationAssertGeneralTransformer;
(function (NotationAssertGeneralTransformer) {
    NotationAssertGeneralTransformer.transform = (rename) => (props) => GenericTransformer.scalar({
        ...props,
        method: `notations.assert${StringUtil.capitalize(rename.name)}`,
        write: (x) => NotationAssertGeneralProgrammer.write({
            ...x,
            rename,
        }),
    });
})(NotationAssertGeneralTransformer || (NotationAssertGeneralTransformer = {}));

export { NotationAssertGeneralTransformer };
//# sourceMappingURL=NotationAssertGeneralTransformer.mjs.map
