"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonValidateParseTransformer = void 0;
const JsonValidateParseProgrammer_1 = require("../../../programmers/json/JsonValidateParseProgrammer");
const GenericTransformer_1 = require("../../internal/GenericTransformer");
var JsonValidateParseTransformer;
(function (JsonValidateParseTransformer) {
    JsonValidateParseTransformer.transform = (props) => GenericTransformer_1.GenericTransformer.scalar(Object.assign(Object.assign({}, props), { method: "json.validateParse", write: JsonValidateParseProgrammer_1.JsonValidateParseProgrammer.write }));
})(JsonValidateParseTransformer || (exports.JsonValidateParseTransformer = JsonValidateParseTransformer = {}));
//# sourceMappingURL=JsonValidateParseTransformer.js.map