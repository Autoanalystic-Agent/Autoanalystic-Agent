import { JsonIsParseProgrammer } from '../../../programmers/json/JsonIsParseProgrammer.mjs';
import { GenericTransformer } from '../../internal/GenericTransformer.mjs';

var JsonIsParseTransformer;
(function (JsonIsParseTransformer) {
    JsonIsParseTransformer.transform = (props) => GenericTransformer.scalar({
        ...props,
        method: "json.isParse",
        write: JsonIsParseProgrammer.write,
    });
})(JsonIsParseTransformer || (JsonIsParseTransformer = {}));

export { JsonIsParseTransformer };
//# sourceMappingURL=JsonIsParseTransformer.mjs.map
