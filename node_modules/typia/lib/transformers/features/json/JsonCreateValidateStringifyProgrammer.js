"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonCreateValidateStringifyTransformer = void 0;
const JsonValidateStringifyProgrammer_1 = require("../../../programmers/json/JsonValidateStringifyProgrammer");
const GenericTransformer_1 = require("../../internal/GenericTransformer");
var JsonCreateValidateStringifyTransformer;
(function (JsonCreateValidateStringifyTransformer) {
    JsonCreateValidateStringifyTransformer.transform = (props) => GenericTransformer_1.GenericTransformer.factory(Object.assign(Object.assign({}, props), { method: "json.createValidateStringify", write: JsonValidateStringifyProgrammer_1.JsonValidateStringifyProgrammer.write }));
})(JsonCreateValidateStringifyTransformer || (exports.JsonCreateValidateStringifyTransformer = JsonCreateValidateStringifyTransformer = {}));
//# sourceMappingURL=JsonCreateValidateStringifyProgrammer.js.map