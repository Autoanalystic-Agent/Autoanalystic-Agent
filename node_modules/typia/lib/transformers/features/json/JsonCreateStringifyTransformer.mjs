import { JsonStringifyProgrammer } from '../../../programmers/json/JsonStringifyProgrammer.mjs';
import { GenericTransformer } from '../../internal/GenericTransformer.mjs';

var JsonCreateStringifyTransformer;
(function (JsonCreateStringifyTransformer) {
    JsonCreateStringifyTransformer.transform = (props) => GenericTransformer.factory({
        ...props,
        method: "json.createStringify",
        write: JsonStringifyProgrammer.write,
    });
})(JsonCreateStringifyTransformer || (JsonCreateStringifyTransformer = {}));

export { JsonCreateStringifyTransformer };
//# sourceMappingURL=JsonCreateStringifyTransformer.mjs.map
