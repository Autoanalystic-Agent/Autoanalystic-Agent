"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonCreateIsStringifyTransformer = void 0;
const JsonIsStringifyProgrammer_1 = require("../../../programmers/json/JsonIsStringifyProgrammer");
const GenericTransformer_1 = require("../../internal/GenericTransformer");
var JsonCreateIsStringifyTransformer;
(function (JsonCreateIsStringifyTransformer) {
    JsonCreateIsStringifyTransformer.transform = (props) => GenericTransformer_1.GenericTransformer.factory(Object.assign(Object.assign({}, props), { method: "json.stringify", write: JsonIsStringifyProgrammer_1.JsonIsStringifyProgrammer.write }));
})(JsonCreateIsStringifyTransformer || (exports.JsonCreateIsStringifyTransformer = JsonCreateIsStringifyTransformer = {}));
//# sourceMappingURL=JsonCreateIsStringifyTransformer.js.map