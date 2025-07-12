import { HttpAssertQueryProgrammer } from '../../../programmers/http/HttpAssertQueryProgrammer.mjs';
import { GenericTransformer } from '../../internal/GenericTransformer.mjs';

var HttpAssertQueryTransformer;
(function (HttpAssertQueryTransformer) {
    HttpAssertQueryTransformer.transform = (props) => GenericTransformer.scalar({
        ...props,
        method: "http.assertQuery",
        write: HttpAssertQueryProgrammer.write,
    });
})(HttpAssertQueryTransformer || (HttpAssertQueryTransformer = {}));

export { HttpAssertQueryTransformer };
//# sourceMappingURL=HttpAssertQueryTransformer.mjs.map
