import { HttpIsHeadersProgrammer } from '../../../programmers/http/HttpIsHeadersProgrammer.mjs';
import { GenericTransformer } from '../../internal/GenericTransformer.mjs';

var HttpIsHeadersTransformer;
(function (HttpIsHeadersTransformer) {
    HttpIsHeadersTransformer.transform = (props) => GenericTransformer.scalar({
        ...props,
        method: "http.isHeaders",
        write: HttpIsHeadersProgrammer.write,
    });
})(HttpIsHeadersTransformer || (HttpIsHeadersTransformer = {}));

export { HttpIsHeadersTransformer };
//# sourceMappingURL=HttpIsHeadersTransformer.mjs.map
