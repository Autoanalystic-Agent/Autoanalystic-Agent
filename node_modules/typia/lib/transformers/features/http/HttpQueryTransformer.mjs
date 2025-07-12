import { HttpQueryProgrammer } from '../../../programmers/http/HttpQueryProgrammer.mjs';
import { GenericTransformer } from '../../internal/GenericTransformer.mjs';

var HttpQueryTransformer;
(function (HttpQueryTransformer) {
    HttpQueryTransformer.transform = (props) => GenericTransformer.scalar({
        ...props,
        method: "http.query",
        write: HttpQueryProgrammer.write,
    });
})(HttpQueryTransformer || (HttpQueryTransformer = {}));

export { HttpQueryTransformer };
//# sourceMappingURL=HttpQueryTransformer.mjs.map
