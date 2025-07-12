import { HttpHeadersProgrammer } from '../../../programmers/http/HttpHeadersProgrammer.mjs';
import { GenericTransformer } from '../../internal/GenericTransformer.mjs';

var CreateHttpHeadersTransformer;
(function (CreateHttpHeadersTransformer) {
    CreateHttpHeadersTransformer.transform = (props) => GenericTransformer.factory({
        ...props,
        method: "http.createHeaders",
        write: HttpHeadersProgrammer.write,
    });
})(CreateHttpHeadersTransformer || (CreateHttpHeadersTransformer = {}));

export { CreateHttpHeadersTransformer };
//# sourceMappingURL=CreateHttpHeadersTransformer.mjs.map
