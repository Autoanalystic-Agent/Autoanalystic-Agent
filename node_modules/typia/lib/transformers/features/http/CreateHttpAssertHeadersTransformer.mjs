import { HttpAssertHeadersProgrammer } from '../../../programmers/http/HttpAssertHeadersProgrammer.mjs';
import { GenericTransformer } from '../../internal/GenericTransformer.mjs';

var CreateHttpAssertHeadersTransformer;
(function (CreateHttpAssertHeadersTransformer) {
    CreateHttpAssertHeadersTransformer.transform = (props) => GenericTransformer.factory({
        ...props,
        method: "http.createAssertHeaders",
        write: HttpAssertHeadersProgrammer.write,
    });
})(CreateHttpAssertHeadersTransformer || (CreateHttpAssertHeadersTransformer = {}));

export { CreateHttpAssertHeadersTransformer };
//# sourceMappingURL=CreateHttpAssertHeadersTransformer.mjs.map
