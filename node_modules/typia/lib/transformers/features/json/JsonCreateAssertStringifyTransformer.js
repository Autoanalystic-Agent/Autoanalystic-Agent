"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonCreateAssertStringifyTransformer = void 0;
const JsonAssertStringifyProgrammer_1 = require("../../../programmers/json/JsonAssertStringifyProgrammer");
const GenericTransformer_1 = require("../../internal/GenericTransformer");
var JsonCreateAssertStringifyTransformer;
(function (JsonCreateAssertStringifyTransformer) {
    JsonCreateAssertStringifyTransformer.transform = (props) => GenericTransformer_1.GenericTransformer.factory(Object.assign(Object.assign({}, props), { method: "json.createAssertStringify", write: JsonAssertStringifyProgrammer_1.JsonAssertStringifyProgrammer.write }));
})(JsonCreateAssertStringifyTransformer || (exports.JsonCreateAssertStringifyTransformer = JsonCreateAssertStringifyTransformer = {}));
//# sourceMappingURL=JsonCreateAssertStringifyTransformer.js.map