import { NotationAssertGeneralProgrammer } from '../../../programmers/notations/NotationAssertGeneralProgrammer.mjs';
import { StringUtil } from '../../../utils/StringUtil.mjs';
import { GenericTransformer } from '../../internal/GenericTransformer.mjs';

var NotationCreateAssertGeneralTransformer;
(function (NotationCreateAssertGeneralTransformer) {
    NotationCreateAssertGeneralTransformer.transform = (rename) => (props) => GenericTransformer.factory({
        ...props,
        method: `notations.createAssert${StringUtil.capitalize(rename.name)}`,
        write: (x) => NotationAssertGeneralProgrammer.write({
            ...x,
            rename,
        }),
    });
})(NotationCreateAssertGeneralTransformer || (NotationCreateAssertGeneralTransformer = {}));

export { NotationCreateAssertGeneralTransformer };
//# sourceMappingURL=NotationCreateAssertGeneralTransformer.mjs.map
