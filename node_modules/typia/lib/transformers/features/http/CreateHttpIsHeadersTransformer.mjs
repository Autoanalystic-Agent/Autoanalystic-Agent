import { HttpIsHeadersProgrammer } from '../../../programmers/http/HttpIsHeadersProgrammer.mjs';
import { GenericTransformer } from '../../internal/GenericTransformer.mjs';

var CreateHttpIsHeadersTransformer;
(function (CreateHttpIsHeadersTransformer) {
    CreateHttpIsHeadersTransformer.transform = (props) => GenericTransformer.factory({
        ...props,
        method: "http.createIsHeaders",
        write: HttpIsHeadersProgrammer.write,
    });
})(CreateHttpIsHeadersTransformer || (CreateHttpIsHeadersTransformer = {}));

export { CreateHttpIsHeadersTransformer };
//# sourceMappingURL=CreateHttpIsHeadersTransformer.mjs.map
