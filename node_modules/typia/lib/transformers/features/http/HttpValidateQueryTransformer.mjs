import { HttpValidateQueryProgrammer } from '../../../programmers/http/HttpValidateQueryProgrammer.mjs';
import { GenericTransformer } from '../../internal/GenericTransformer.mjs';

var HttpValidateQueryTransformer;
(function (HttpValidateQueryTransformer) {
    HttpValidateQueryTransformer.transform = (props) => GenericTransformer.scalar({
        ...props,
        method: "http.validateQuery",
        write: HttpValidateQueryProgrammer.write,
    });
})(HttpValidateQueryTransformer || (HttpValidateQueryTransformer = {}));

export { HttpValidateQueryTransformer };
//# sourceMappingURL=HttpValidateQueryTransformer.mjs.map
