import { JsonAssertParseProgrammer } from '../../../programmers/json/JsonAssertParseProgrammer.mjs';
import { GenericTransformer } from '../../internal/GenericTransformer.mjs';

var JsonAssertParseTransformer;
(function (JsonAssertParseTransformer) {
    JsonAssertParseTransformer.transform = (props) => GenericTransformer.scalar({
        ...props,
        method: "json.assertParse",
        write: JsonAssertParseProgrammer.write,
    });
})(JsonAssertParseTransformer || (JsonAssertParseTransformer = {}));

export { JsonAssertParseTransformer };
//# sourceMappingURL=JsonAssertParseTransformer.mjs.map
