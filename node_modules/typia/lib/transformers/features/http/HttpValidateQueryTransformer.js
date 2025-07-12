"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpValidateQueryTransformer = void 0;
const HttpValidateQueryProgrammer_1 = require("../../../programmers/http/HttpValidateQueryProgrammer");
const GenericTransformer_1 = require("../../internal/GenericTransformer");
var HttpValidateQueryTransformer;
(function (HttpValidateQueryTransformer) {
    HttpValidateQueryTransformer.transform = (props) => GenericTransformer_1.GenericTransformer.scalar(Object.assign(Object.assign({}, props), { method: "http.validateQuery", write: HttpValidateQueryProgrammer_1.HttpValidateQueryProgrammer.write }));
})(HttpValidateQueryTransformer || (exports.HttpValidateQueryTransformer = HttpValidateQueryTransformer = {}));
//# sourceMappingURL=HttpValidateQueryTransformer.js.map