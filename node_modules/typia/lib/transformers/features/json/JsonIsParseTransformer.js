"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonIsParseTransformer = void 0;
const JsonIsParseProgrammer_1 = require("../../../programmers/json/JsonIsParseProgrammer");
const GenericTransformer_1 = require("../../internal/GenericTransformer");
var JsonIsParseTransformer;
(function (JsonIsParseTransformer) {
    JsonIsParseTransformer.transform = (props) => GenericTransformer_1.GenericTransformer.scalar(Object.assign(Object.assign({}, props), { method: "json.isParse", write: JsonIsParseProgrammer_1.JsonIsParseProgrammer.write }));
})(JsonIsParseTransformer || (exports.JsonIsParseTransformer = JsonIsParseTransformer = {}));
//# sourceMappingURL=JsonIsParseTransformer.js.map