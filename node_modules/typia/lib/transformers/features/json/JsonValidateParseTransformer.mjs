import { JsonValidateParseProgrammer } from '../../../programmers/json/JsonValidateParseProgrammer.mjs';
import { GenericTransformer } from '../../internal/GenericTransformer.mjs';

var JsonValidateParseTransformer;
(function (JsonValidateParseTransformer) {
    JsonValidateParseTransformer.transform = (props) => GenericTransformer.scalar({
        ...props,
        method: "json.validateParse",
        write: JsonValidateParseProgrammer.write,
    });
})(JsonValidateParseTransformer || (JsonValidateParseTransformer = {}));

export { JsonValidateParseTransformer };
//# sourceMappingURL=JsonValidateParseTransformer.mjs.map
