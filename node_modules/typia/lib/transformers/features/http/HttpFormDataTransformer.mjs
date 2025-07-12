import { HttpFormDataProgrammer } from '../../../programmers/http/HttpFormDataProgrammer.mjs';
import { GenericTransformer } from '../../internal/GenericTransformer.mjs';

var HttpFormDataTransformer;
(function (HttpFormDataTransformer) {
    HttpFormDataTransformer.transform = (props) => GenericTransformer.scalar({
        ...props,
        method: "http.formdata",
        write: HttpFormDataProgrammer.write,
    });
})(HttpFormDataTransformer || (HttpFormDataTransformer = {}));

export { HttpFormDataTransformer };
//# sourceMappingURL=HttpFormDataTransformer.mjs.map
