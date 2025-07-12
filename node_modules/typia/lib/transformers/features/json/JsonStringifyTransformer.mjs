import { JsonStringifyProgrammer } from '../../../programmers/json/JsonStringifyProgrammer.mjs';
import { GenericTransformer } from '../../internal/GenericTransformer.mjs';

var JsonStringifyTransformer;
(function (JsonStringifyTransformer) {
    JsonStringifyTransformer.transform = (props) => GenericTransformer.scalar({
        ...props,
        method: "json.stringify",
        write: JsonStringifyProgrammer.write,
    });
})(JsonStringifyTransformer || (JsonStringifyTransformer = {}));

export { JsonStringifyTransformer };
//# sourceMappingURL=JsonStringifyTransformer.mjs.map
