"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonStringifyTransformer = void 0;
const JsonStringifyProgrammer_1 = require("../../../programmers/json/JsonStringifyProgrammer");
const GenericTransformer_1 = require("../../internal/GenericTransformer");
var JsonStringifyTransformer;
(function (JsonStringifyTransformer) {
    JsonStringifyTransformer.transform = (props) => GenericTransformer_1.GenericTransformer.scalar(Object.assign(Object.assign({}, props), { method: "json.stringify", write: JsonStringifyProgrammer_1.JsonStringifyProgrammer.write }));
})(JsonStringifyTransformer || (exports.JsonStringifyTransformer = JsonStringifyTransformer = {}));
//# sourceMappingURL=JsonStringifyTransformer.js.map