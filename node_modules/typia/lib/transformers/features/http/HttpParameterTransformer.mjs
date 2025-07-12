import { HttpParameterProgrammer } from '../../../programmers/http/HttpParameterProgrammer.mjs';
import { GenericTransformer } from '../../internal/GenericTransformer.mjs';

var HttpParameterTransformer;
(function (HttpParameterTransformer) {
    HttpParameterTransformer.transform = (props) => GenericTransformer.scalar({
        ...props,
        method: "http.parameter",
        write: HttpParameterProgrammer.write,
    });
})(HttpParameterTransformer || (HttpParameterTransformer = {}));

export { HttpParameterTransformer };
//# sourceMappingURL=HttpParameterTransformer.mjs.map
