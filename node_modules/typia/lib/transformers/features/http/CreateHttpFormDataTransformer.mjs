import { HttpFormDataProgrammer } from '../../../programmers/http/HttpFormDataProgrammer.mjs';
import { GenericTransformer } from '../../internal/GenericTransformer.mjs';

var CreateHttpFormDataTransformer;
(function (CreateHttpFormDataTransformer) {
    CreateHttpFormDataTransformer.transform = (props) => GenericTransformer.factory({
        ...props,
        method: "http.createFormData",
        write: HttpFormDataProgrammer.write,
    });
})(CreateHttpFormDataTransformer || (CreateHttpFormDataTransformer = {}));

export { CreateHttpFormDataTransformer };
//# sourceMappingURL=CreateHttpFormDataTransformer.mjs.map
