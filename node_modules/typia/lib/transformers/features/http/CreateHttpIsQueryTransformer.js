"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateHttpIsQueryTransformer = void 0;
const HttpIsQueryProgrammer_1 = require("../../../programmers/http/HttpIsQueryProgrammer");
const GenericTransformer_1 = require("../../internal/GenericTransformer");
var CreateHttpIsQueryTransformer;
(function (CreateHttpIsQueryTransformer) {
    CreateHttpIsQueryTransformer.transform = (props) => GenericTransformer_1.GenericTransformer.factory(Object.assign(Object.assign({}, props), { method: "http.createIsQuery", write: HttpIsQueryProgrammer_1.HttpIsQueryProgrammer.write }));
})(CreateHttpIsQueryTransformer || (exports.CreateHttpIsQueryTransformer = CreateHttpIsQueryTransformer = {}));
//# sourceMappingURL=CreateHttpIsQueryTransformer.js.map