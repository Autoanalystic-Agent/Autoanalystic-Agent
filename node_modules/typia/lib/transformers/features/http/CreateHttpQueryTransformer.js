"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateHttpQueryTransformer = void 0;
const HttpQueryProgrammer_1 = require("../../../programmers/http/HttpQueryProgrammer");
const GenericTransformer_1 = require("../../internal/GenericTransformer");
var CreateHttpQueryTransformer;
(function (CreateHttpQueryTransformer) {
    CreateHttpQueryTransformer.transform = (props) => GenericTransformer_1.GenericTransformer.factory(Object.assign(Object.assign({}, props), { method: "http.createQuery", write: HttpQueryProgrammer_1.HttpQueryProgrammer.write }));
})(CreateHttpQueryTransformer || (exports.CreateHttpQueryTransformer = CreateHttpQueryTransformer = {}));
//# sourceMappingURL=CreateHttpQueryTransformer.js.map