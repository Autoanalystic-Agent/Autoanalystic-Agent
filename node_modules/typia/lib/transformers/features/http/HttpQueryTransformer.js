"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpQueryTransformer = void 0;
const HttpQueryProgrammer_1 = require("../../../programmers/http/HttpQueryProgrammer");
const GenericTransformer_1 = require("../../internal/GenericTransformer");
var HttpQueryTransformer;
(function (HttpQueryTransformer) {
    HttpQueryTransformer.transform = (props) => GenericTransformer_1.GenericTransformer.scalar(Object.assign(Object.assign({}, props), { method: "http.query", write: HttpQueryProgrammer_1.HttpQueryProgrammer.write }));
})(HttpQueryTransformer || (exports.HttpQueryTransformer = HttpQueryTransformer = {}));
//# sourceMappingURL=HttpQueryTransformer.js.map