"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonValidateStringifyTransformer = void 0;
const JsonValidateStringifyProgrammer_1 = require("../../../programmers/json/JsonValidateStringifyProgrammer");
const GenericTransformer_1 = require("../../internal/GenericTransformer");
var JsonValidateStringifyTransformer;
(function (JsonValidateStringifyTransformer) {
    JsonValidateStringifyTransformer.transform = (props) => GenericTransformer_1.GenericTransformer.scalar(Object.assign(Object.assign({}, props), { method: "json.validateStringify", write: JsonValidateStringifyProgrammer_1.JsonValidateStringifyProgrammer.write }));
})(JsonValidateStringifyTransformer || (exports.JsonValidateStringifyTransformer = JsonValidateStringifyTransformer = {}));
//# sourceMappingURL=JsonValidateStringifyTransformer.js.map