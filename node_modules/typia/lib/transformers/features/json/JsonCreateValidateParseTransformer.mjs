import { JsonValidateParseProgrammer } from '../../../programmers/json/JsonValidateParseProgrammer.mjs';
import { GenericTransformer } from '../../internal/GenericTransformer.mjs';

var JsonCreateValidateParseTransformer;
(function (JsonCreateValidateParseTransformer) {
    JsonCreateValidateParseTransformer.transform = (props) => GenericTransformer.factory({
        ...props,
        method: "json.createValidateParse",
        write: JsonValidateParseProgrammer.write,
    });
})(JsonCreateValidateParseTransformer || (JsonCreateValidateParseTransformer = {}));

export { JsonCreateValidateParseTransformer };
//# sourceMappingURL=JsonCreateValidateParseTransformer.mjs.map
