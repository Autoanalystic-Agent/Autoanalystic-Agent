"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonCreateValidateParseTransformer = void 0;
const JsonValidateParseProgrammer_1 = require("../../../programmers/json/JsonValidateParseProgrammer");
const GenericTransformer_1 = require("../../internal/GenericTransformer");
var JsonCreateValidateParseTransformer;
(function (JsonCreateValidateParseTransformer) {
    JsonCreateValidateParseTransformer.transform = (props) => GenericTransformer_1.GenericTransformer.factory(Object.assign(Object.assign({}, props), { method: "json.createValidateParse", write: JsonValidateParseProgrammer_1.JsonValidateParseProgrammer.write }));
})(JsonCreateValidateParseTransformer || (exports.JsonCreateValidateParseTransformer = JsonCreateValidateParseTransformer = {}));
//# sourceMappingURL=JsonCreateValidateParseTransformer.js.map