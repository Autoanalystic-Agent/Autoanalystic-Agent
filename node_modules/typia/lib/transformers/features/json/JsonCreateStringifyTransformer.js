"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonCreateStringifyTransformer = void 0;
const JsonStringifyProgrammer_1 = require("../../../programmers/json/JsonStringifyProgrammer");
const GenericTransformer_1 = require("../../internal/GenericTransformer");
var JsonCreateStringifyTransformer;
(function (JsonCreateStringifyTransformer) {
    JsonCreateStringifyTransformer.transform = (props) => GenericTransformer_1.GenericTransformer.factory(Object.assign(Object.assign({}, props), { method: "json.createStringify", write: JsonStringifyProgrammer_1.JsonStringifyProgrammer.write }));
})(JsonCreateStringifyTransformer || (exports.JsonCreateStringifyTransformer = JsonCreateStringifyTransformer = {}));
//# sourceMappingURL=JsonCreateStringifyTransformer.js.map