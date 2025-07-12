import { HttpAssertHeadersProgrammer } from '../../../programmers/http/HttpAssertHeadersProgrammer.mjs';
import { GenericTransformer } from '../../internal/GenericTransformer.mjs';

var HttpAssertHeadersTransformer;
(function (HttpAssertHeadersTransformer) {
    HttpAssertHeadersTransformer.transform = (props) => GenericTransformer.scalar({
        ...props,
        method: "http.assertHeaders",
        write: HttpAssertHeadersProgrammer.write,
    });
})(HttpAssertHeadersTransformer || (HttpAssertHeadersTransformer = {}));

export { HttpAssertHeadersTransformer };
//# sourceMappingURL=HttpAssertHeadersTransformer.mjs.map
