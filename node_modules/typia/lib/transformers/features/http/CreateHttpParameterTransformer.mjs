import { HttpParameterProgrammer } from '../../../programmers/http/HttpParameterProgrammer.mjs';
import { GenericTransformer } from '../../internal/GenericTransformer.mjs';

var CreateHttpParameterTransformer;
(function (CreateHttpParameterTransformer) {
    CreateHttpParameterTransformer.transform = (props) => GenericTransformer.factory({
        ...props,
        method: "http.createParameter",
        write: HttpParameterProgrammer.write,
    });
})(CreateHttpParameterTransformer || (CreateHttpParameterTransformer = {}));

export { CreateHttpParameterTransformer };
//# sourceMappingURL=CreateHttpParameterTransformer.mjs.map
