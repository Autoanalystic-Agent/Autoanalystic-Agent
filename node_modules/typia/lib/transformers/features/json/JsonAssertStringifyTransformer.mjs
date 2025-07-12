import { JsonAssertStringifyProgrammer } from '../../../programmers/json/JsonAssertStringifyProgrammer.mjs';
import { GenericTransformer } from '../../internal/GenericTransformer.mjs';

var JsonAssertStringifyTransformer;
(function (JsonAssertStringifyTransformer) {
    JsonAssertStringifyTransformer.transform = (props) => GenericTransformer.scalar({
        ...props,
        method: "json.assertStringify",
        write: JsonAssertStringifyProgrammer.write,
    });
})(JsonAssertStringifyTransformer || (JsonAssertStringifyTransformer = {}));

export { JsonAssertStringifyTransformer };
//# sourceMappingURL=JsonAssertStringifyTransformer.mjs.map
