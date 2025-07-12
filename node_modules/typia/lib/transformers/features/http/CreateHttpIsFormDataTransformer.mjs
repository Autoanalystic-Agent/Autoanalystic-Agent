import { HttpIsFormDataProgrammer } from '../../../programmers/http/HttpIsFormDataProgrammer.mjs';
import { GenericTransformer } from '../../internal/GenericTransformer.mjs';

var CreateHttpIsFormDataTransformer;
(function (CreateHttpIsFormDataTransformer) {
    CreateHttpIsFormDataTransformer.transform = (props) => GenericTransformer.factory({
        ...props,
        method: "http.createIsFormData",
        write: HttpIsFormDataProgrammer.write,
    });
})(CreateHttpIsFormDataTransformer || (CreateHttpIsFormDataTransformer = {}));

export { CreateHttpIsFormDataTransformer };
//# sourceMappingURL=CreateHttpIsFormDataTransformer.mjs.map
