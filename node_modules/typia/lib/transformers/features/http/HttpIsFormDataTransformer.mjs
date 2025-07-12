import { HttpIsFormDataProgrammer } from '../../../programmers/http/HttpIsFormDataProgrammer.mjs';
import { GenericTransformer } from '../../internal/GenericTransformer.mjs';

var HttpIsFormDataTransformer;
(function (HttpIsFormDataTransformer) {
    HttpIsFormDataTransformer.transform = (props) => GenericTransformer.scalar({
        ...props,
        method: "http.isFormData",
        write: HttpIsFormDataProgrammer.write,
    });
})(HttpIsFormDataTransformer || (HttpIsFormDataTransformer = {}));

export { HttpIsFormDataTransformer };
//# sourceMappingURL=HttpIsFormDataTransformer.mjs.map
