import { HttpAssertFormDataProgrammer } from '../../../programmers/http/HttpAssertFormDataProgrammer.mjs';
import { GenericTransformer } from '../../internal/GenericTransformer.mjs';

var CreateHttpAssertFormDataTransformer;
(function (CreateHttpAssertFormDataTransformer) {
    CreateHttpAssertFormDataTransformer.transform = (props) => GenericTransformer.factory({
        ...props,
        method: "http.createAssertFormData",
        write: HttpAssertFormDataProgrammer.write,
    });
})(CreateHttpAssertFormDataTransformer || (CreateHttpAssertFormDataTransformer = {}));

export { CreateHttpAssertFormDataTransformer };
//# sourceMappingURL=CreateHttpAssertFormDataTransformer.mjs.map
