import { HttpIsQueryProgrammer } from '../../../programmers/http/HttpIsQueryProgrammer.mjs';
import { GenericTransformer } from '../../internal/GenericTransformer.mjs';

var CreateHttpIsQueryTransformer;
(function (CreateHttpIsQueryTransformer) {
    CreateHttpIsQueryTransformer.transform = (props) => GenericTransformer.factory({
        ...props,
        method: "http.createIsQuery",
        write: HttpIsQueryProgrammer.write,
    });
})(CreateHttpIsQueryTransformer || (CreateHttpIsQueryTransformer = {}));

export { CreateHttpIsQueryTransformer };
//# sourceMappingURL=CreateHttpIsQueryTransformer.mjs.map
