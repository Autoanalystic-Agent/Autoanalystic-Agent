import { JsonValidateStringifyProgrammer } from '../../../programmers/json/JsonValidateStringifyProgrammer.mjs';
import { GenericTransformer } from '../../internal/GenericTransformer.mjs';

var JsonValidateStringifyTransformer;
(function (JsonValidateStringifyTransformer) {
    JsonValidateStringifyTransformer.transform = (props) => GenericTransformer.scalar({
        ...props,
        method: "json.validateStringify",
        write: JsonValidateStringifyProgrammer.write,
    });
})(JsonValidateStringifyTransformer || (JsonValidateStringifyTransformer = {}));

export { JsonValidateStringifyTransformer };
//# sourceMappingURL=JsonValidateStringifyTransformer.mjs.map
