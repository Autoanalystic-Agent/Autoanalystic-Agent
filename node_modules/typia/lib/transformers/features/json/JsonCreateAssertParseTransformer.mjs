import { JsonAssertParseProgrammer } from '../../../programmers/json/JsonAssertParseProgrammer.mjs';
import { GenericTransformer } from '../../internal/GenericTransformer.mjs';

var JsonCreateAssertParseTransformer;
(function (JsonCreateAssertParseTransformer) {
    JsonCreateAssertParseTransformer.transform = (props) => GenericTransformer.factory({
        ...props,
        method: "json.createAssertParse",
        write: JsonAssertParseProgrammer.write,
    });
})(JsonCreateAssertParseTransformer || (JsonCreateAssertParseTransformer = {}));

export { JsonCreateAssertParseTransformer };
//# sourceMappingURL=JsonCreateAssertParseTransformer.mjs.map
