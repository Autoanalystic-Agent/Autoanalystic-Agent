import { HttpHeadersProgrammer } from '../../../programmers/http/HttpHeadersProgrammer.mjs';
import { GenericTransformer } from '../../internal/GenericTransformer.mjs';

var HttpHeadersTransformer;
(function (HttpHeadersTransformer) {
    HttpHeadersTransformer.transform = (props) => GenericTransformer.scalar({
        ...props,
        method: "http.headers",
        write: HttpHeadersProgrammer.write,
    });
})(HttpHeadersTransformer || (HttpHeadersTransformer = {}));

export { HttpHeadersTransformer };
//# sourceMappingURL=HttpHeadersTransformer.mjs.map
