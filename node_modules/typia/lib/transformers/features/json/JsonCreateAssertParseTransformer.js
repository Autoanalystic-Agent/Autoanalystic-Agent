"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonCreateAssertParseTransformer = void 0;
const JsonAssertParseProgrammer_1 = require("../../../programmers/json/JsonAssertParseProgrammer");
const GenericTransformer_1 = require("../../internal/GenericTransformer");
var JsonCreateAssertParseTransformer;
(function (JsonCreateAssertParseTransformer) {
    JsonCreateAssertParseTransformer.transform = (props) => GenericTransformer_1.GenericTransformer.factory(Object.assign(Object.assign({}, props), { method: "json.createAssertParse", write: JsonAssertParseProgrammer_1.JsonAssertParseProgrammer.write }));
})(JsonCreateAssertParseTransformer || (exports.JsonCreateAssertParseTransformer = JsonCreateAssertParseTransformer = {}));
//# sourceMappingURL=JsonCreateAssertParseTransformer.js.map