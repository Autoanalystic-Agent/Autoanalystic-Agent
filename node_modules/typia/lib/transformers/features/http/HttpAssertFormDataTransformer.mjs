import { HttpAssertFormDataProgrammer } from '../../../programmers/http/HttpAssertFormDataProgrammer.mjs';
import { GenericTransformer } from '../../internal/GenericTransformer.mjs';

var HttpAssertFormDataTransformer;
(function (HttpAssertFormDataTransformer) {
    HttpAssertFormDataTransformer.transform = (props) => GenericTransformer.scalar({
        ...props,
        method: "http.assertFormData",
        write: HttpAssertFormDataProgrammer.write,
    });
})(HttpAssertFormDataTransformer || (HttpAssertFormDataTransformer = {}));

export { HttpAssertFormDataTransformer };
//# sourceMappingURL=HttpAssertFormDataTransformer.mjs.map
