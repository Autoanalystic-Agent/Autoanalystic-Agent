import { HttpValidateHeadersProgrammer } from '../../../programmers/http/HttpValidateHeadersProgrammer.mjs';
import { GenericTransformer } from '../../internal/GenericTransformer.mjs';

var HttpValidateHeadersTransformer;
(function (HttpValidateHeadersTransformer) {
    HttpValidateHeadersTransformer.transform = (props) => GenericTransformer.scalar({
        ...props,
        method: "http.validateHeaders",
        write: HttpValidateHeadersProgrammer.write,
    });
})(HttpValidateHeadersTransformer || (HttpValidateHeadersTransformer = {}));

export { HttpValidateHeadersTransformer };
//# sourceMappingURL=HttpValidateHeadersTransformer.mjs.map
