import { HttpValidateFormDataProgrammer } from '../../../programmers/http/HttpValidateFormDataProgrammer.mjs';
import { GenericTransformer } from '../../internal/GenericTransformer.mjs';

var CreateHttpValidateFormDataTransformer;
(function (CreateHttpValidateFormDataTransformer) {
    CreateHttpValidateFormDataTransformer.transform = (props) => GenericTransformer.factory({
        ...props,
        method: "http.createValidateFormData",
        write: HttpValidateFormDataProgrammer.write,
    });
})(CreateHttpValidateFormDataTransformer || (CreateHttpValidateFormDataTransformer = {}));

export { CreateHttpValidateFormDataTransformer };
//# sourceMappingURL=CreateHttpValidateFormDataTransformer.mjs.map
