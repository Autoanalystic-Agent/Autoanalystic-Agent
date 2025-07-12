import { HttpIsQueryProgrammer } from '../../../programmers/http/HttpIsQueryProgrammer.mjs';
import { GenericTransformer } from '../../internal/GenericTransformer.mjs';

var HttpIsQueryTransformer;
(function (HttpIsQueryTransformer) {
    HttpIsQueryTransformer.transform = (props) => GenericTransformer.scalar({
        ...props,
        method: "http.isQuery",
        write: HttpIsQueryProgrammer.write,
    });
})(HttpIsQueryTransformer || (HttpIsQueryTransformer = {}));

export { HttpIsQueryTransformer };
//# sourceMappingURL=HttpIsQueryTransformer.mjs.map
