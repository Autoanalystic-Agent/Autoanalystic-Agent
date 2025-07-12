import { HttpValidateFormDataProgrammer } from '../../../programmers/http/HttpValidateFormDataProgrammer.mjs';
import { GenericTransformer } from '../../internal/GenericTransformer.mjs';

var HttpValidateFormDataTransformer;
(function (HttpValidateFormDataTransformer) {
    HttpValidateFormDataTransformer.transform = (props) => GenericTransformer.scalar({
        ...props,
        method: "http.validateFormData",
        write: HttpValidateFormDataProgrammer.write,
    });
})(HttpValidateFormDataTransformer || (HttpValidateFormDataTransformer = {}));

export { HttpValidateFormDataTransformer };
//# sourceMappingURL=HttpValidateFormDataTransformer.mjs.map
