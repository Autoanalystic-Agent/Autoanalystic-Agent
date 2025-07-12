import { HttpQueryProgrammer } from '../../../programmers/http/HttpQueryProgrammer.mjs';
import { GenericTransformer } from '../../internal/GenericTransformer.mjs';

var CreateHttpQueryTransformer;
(function (CreateHttpQueryTransformer) {
    CreateHttpQueryTransformer.transform = (props) => GenericTransformer.factory({
        ...props,
        method: "http.createQuery",
        write: HttpQueryProgrammer.write,
    });
})(CreateHttpQueryTransformer || (CreateHttpQueryTransformer = {}));

export { CreateHttpQueryTransformer };
//# sourceMappingURL=CreateHttpQueryTransformer.mjs.map
