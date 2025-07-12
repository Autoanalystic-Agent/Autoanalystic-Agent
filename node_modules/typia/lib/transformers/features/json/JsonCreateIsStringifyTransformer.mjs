import { JsonIsStringifyProgrammer } from '../../../programmers/json/JsonIsStringifyProgrammer.mjs';
import { GenericTransformer } from '../../internal/GenericTransformer.mjs';

var JsonCreateIsStringifyTransformer;
(function (JsonCreateIsStringifyTransformer) {
    JsonCreateIsStringifyTransformer.transform = (props) => GenericTransformer.factory({
        ...props,
        method: "json.stringify",
        write: JsonIsStringifyProgrammer.write,
    });
})(JsonCreateIsStringifyTransformer || (JsonCreateIsStringifyTransformer = {}));

export { JsonCreateIsStringifyTransformer };
//# sourceMappingURL=JsonCreateIsStringifyTransformer.mjs.map
