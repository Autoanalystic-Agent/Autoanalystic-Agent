import { HttpAssertQueryProgrammer } from '../../../programmers/http/HttpAssertQueryProgrammer.mjs';
import { GenericTransformer } from '../../internal/GenericTransformer.mjs';

var CreateHttpAssertQueryTransformer;
(function (CreateHttpAssertQueryTransformer) {
    CreateHttpAssertQueryTransformer.transform = (props) => GenericTransformer.factory({
        ...props,
        method: "http.createAssertQuery",
        write: HttpAssertQueryProgrammer.write,
    });
})(CreateHttpAssertQueryTransformer || (CreateHttpAssertQueryTransformer = {}));

export { CreateHttpAssertQueryTransformer };
//# sourceMappingURL=CreateHttpAssertQueryTransformer.mjs.map
