"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpIsQueryTransformer = void 0;
const HttpIsQueryProgrammer_1 = require("../../../programmers/http/HttpIsQueryProgrammer");
const GenericTransformer_1 = require("../../internal/GenericTransformer");
var HttpIsQueryTransformer;
(function (HttpIsQueryTransformer) {
    HttpIsQueryTransformer.transform = (props) => GenericTransformer_1.GenericTransformer.scalar(Object.assign(Object.assign({}, props), { method: "http.isQuery", write: HttpIsQueryProgrammer_1.HttpIsQueryProgrammer.write }));
})(HttpIsQueryTransformer || (exports.HttpIsQueryTransformer = HttpIsQueryTransformer = {}));
//# sourceMappingURL=HttpIsQueryTransformer.js.map