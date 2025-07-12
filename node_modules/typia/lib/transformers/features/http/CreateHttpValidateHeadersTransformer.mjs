import { HttpValidateHeadersProgrammer } from '../../../programmers/http/HttpValidateHeadersProgrammer.mjs';
import { GenericTransformer } from '../../internal/GenericTransformer.mjs';

var CreateHttpValidateHeadersTransformer;
(function (CreateHttpValidateHeadersTransformer) {
    CreateHttpValidateHeadersTransformer.transform = (props) => GenericTransformer.factory({
        ...props,
        method: "http.createValidateHeaders",
        write: HttpValidateHeadersProgrammer.write,
    });
})(CreateHttpValidateHeadersTransformer || (CreateHttpValidateHeadersTransformer = {}));

export { CreateHttpValidateHeadersTransformer };
//# sourceMappingURL=CreateHttpValidateHeadersTransformer.mjs.map
