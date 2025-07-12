import { JsonIsParseProgrammer } from '../../../programmers/json/JsonIsParseProgrammer.mjs';
import { GenericTransformer } from '../../internal/GenericTransformer.mjs';

var JsonCreateIsParseTransformer;
(function (JsonCreateIsParseTransformer) {
    JsonCreateIsParseTransformer.transform = (props) => GenericTransformer.factory({
        ...props,
        method: "json.createIsParse",
        write: JsonIsParseProgrammer.write,
    });
})(JsonCreateIsParseTransformer || (JsonCreateIsParseTransformer = {}));

export { JsonCreateIsParseTransformer };
//# sourceMappingURL=JsonCreateIsParseTransformer.mjs.map
