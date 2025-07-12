"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonAssertParseTransformer = void 0;
const JsonAssertParseProgrammer_1 = require("../../../programmers/json/JsonAssertParseProgrammer");
const GenericTransformer_1 = require("../../internal/GenericTransformer");
var JsonAssertParseTransformer;
(function (JsonAssertParseTransformer) {
    JsonAssertParseTransformer.transform = (props) => GenericTransformer_1.GenericTransformer.scalar(Object.assign(Object.assign({}, props), { method: "json.assertParse", write: JsonAssertParseProgrammer_1.JsonAssertParseProgrammer.write }));
})(JsonAssertParseTransformer || (exports.JsonAssertParseTransformer = JsonAssertParseTransformer = {}));
//# sourceMappingURL=JsonAssertParseTransformer.js.map