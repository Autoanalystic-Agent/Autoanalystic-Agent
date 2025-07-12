"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateHttpValidateQueryTransformer = void 0;
const HttpValidateQueryProgrammer_1 = require("../../../programmers/http/HttpValidateQueryProgrammer");
const GenericTransformer_1 = require("../../internal/GenericTransformer");
var CreateHttpValidateQueryTransformer;
(function (CreateHttpValidateQueryTransformer) {
    CreateHttpValidateQueryTransformer.transform = (props) => GenericTransformer_1.GenericTransformer.factory(Object.assign(Object.assign({}, props), { method: "http.createValidateQuery", write: HttpValidateQueryProgrammer_1.HttpValidateQueryProgrammer.write }));
})(CreateHttpValidateQueryTransformer || (exports.CreateHttpValidateQueryTransformer = CreateHttpValidateQueryTransformer = {}));
//# sourceMappingURL=CreateHttpValidateQueryTransformer.js.map