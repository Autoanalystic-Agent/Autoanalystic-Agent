"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonAssertStringifyTransformer = void 0;
const JsonAssertStringifyProgrammer_1 = require("../../../programmers/json/JsonAssertStringifyProgrammer");
const GenericTransformer_1 = require("../../internal/GenericTransformer");
var JsonAssertStringifyTransformer;
(function (JsonAssertStringifyTransformer) {
    JsonAssertStringifyTransformer.transform = (props) => GenericTransformer_1.GenericTransformer.scalar(Object.assign(Object.assign({}, props), { method: "json.assertStringify", write: JsonAssertStringifyProgrammer_1.JsonAssertStringifyProgrammer.write }));
})(JsonAssertStringifyTransformer || (exports.JsonAssertStringifyTransformer = JsonAssertStringifyTransformer = {}));
//# sourceMappingURL=JsonAssertStringifyTransformer.js.map