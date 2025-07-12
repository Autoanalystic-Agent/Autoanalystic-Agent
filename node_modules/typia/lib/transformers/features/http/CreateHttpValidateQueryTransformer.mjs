import { HttpValidateQueryProgrammer } from '../../../programmers/http/HttpValidateQueryProgrammer.mjs';
import { GenericTransformer } from '../../internal/GenericTransformer.mjs';

var CreateHttpValidateQueryTransformer;
(function (CreateHttpValidateQueryTransformer) {
    CreateHttpValidateQueryTransformer.transform = (props) => GenericTransformer.factory({
        ...props,
        method: "http.createValidateQuery",
        write: HttpValidateQueryProgrammer.write,
    });
})(CreateHttpValidateQueryTransformer || (CreateHttpValidateQueryTransformer = {}));

export { CreateHttpValidateQueryTransformer };
//# sourceMappingURL=CreateHttpValidateQueryTransformer.mjs.map
