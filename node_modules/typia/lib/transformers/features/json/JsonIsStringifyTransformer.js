"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonIsStringifyTransformer = void 0;
const JsonIsStringifyProgrammer_1 = require("../../../programmers/json/JsonIsStringifyProgrammer");
const GenericTransformer_1 = require("../../internal/GenericTransformer");
var JsonIsStringifyTransformer;
(function (JsonIsStringifyTransformer) {
    JsonIsStringifyTransformer.transform = (props) => GenericTransformer_1.GenericTransformer.scalar(Object.assign(Object.assign({}, props), { method: "json.isStringify", write: JsonIsStringifyProgrammer_1.JsonIsStringifyProgrammer.write }));
})(JsonIsStringifyTransformer || (exports.JsonIsStringifyTransformer = JsonIsStringifyTransformer = {}));
//# sourceMappingURL=JsonIsStringifyTransformer.js.map