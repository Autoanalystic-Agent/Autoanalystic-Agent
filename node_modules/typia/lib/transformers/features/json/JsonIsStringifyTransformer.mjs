import { JsonIsStringifyProgrammer } from '../../../programmers/json/JsonIsStringifyProgrammer.mjs';
import { GenericTransformer } from '../../internal/GenericTransformer.mjs';

var JsonIsStringifyTransformer;
(function (JsonIsStringifyTransformer) {
    JsonIsStringifyTransformer.transform = (props) => GenericTransformer.scalar({
        ...props,
        method: "json.isStringify",
        write: JsonIsStringifyProgrammer.write,
    });
})(JsonIsStringifyTransformer || (JsonIsStringifyTransformer = {}));

export { JsonIsStringifyTransformer };
//# sourceMappingURL=JsonIsStringifyTransformer.mjs.map
