import { JsonAssertStringifyProgrammer } from '../../../programmers/json/JsonAssertStringifyProgrammer.mjs';
import { GenericTransformer } from '../../internal/GenericTransformer.mjs';

var JsonCreateAssertStringifyTransformer;
(function (JsonCreateAssertStringifyTransformer) {
    JsonCreateAssertStringifyTransformer.transform = (props) => GenericTransformer.factory({
        ...props,
        method: "json.createAssertStringify",
        write: JsonAssertStringifyProgrammer.write,
    });
})(JsonCreateAssertStringifyTransformer || (JsonCreateAssertStringifyTransformer = {}));

export { JsonCreateAssertStringifyTransformer };
//# sourceMappingURL=JsonCreateAssertStringifyTransformer.mjs.map
