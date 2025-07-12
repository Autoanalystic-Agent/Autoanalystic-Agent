import { JsonValidateStringifyProgrammer } from '../../../programmers/json/JsonValidateStringifyProgrammer.mjs';
import { GenericTransformer } from '../../internal/GenericTransformer.mjs';

var JsonCreateValidateStringifyTransformer;
(function (JsonCreateValidateStringifyTransformer) {
    JsonCreateValidateStringifyTransformer.transform = (props) => GenericTransformer.factory({
        ...props,
        method: "json.createValidateStringify",
        write: JsonValidateStringifyProgrammer.write,
    });
})(JsonCreateValidateStringifyTransformer || (JsonCreateValidateStringifyTransformer = {}));

export { JsonCreateValidateStringifyTransformer };
//# sourceMappingURL=JsonCreateValidateStringifyProgrammer.mjs.map
