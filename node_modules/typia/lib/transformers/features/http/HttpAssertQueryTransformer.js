"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpAssertQueryTransformer = void 0;
const HttpAssertQueryProgrammer_1 = require("../../../programmers/http/HttpAssertQueryProgrammer");
const GenericTransformer_1 = require("../../internal/GenericTransformer");
var HttpAssertQueryTransformer;
(function (HttpAssertQueryTransformer) {
    HttpAssertQueryTransformer.transform = (props) => GenericTransformer_1.GenericTransformer.scalar(Object.assign(Object.assign({}, props), { method: "http.assertQuery", write: HttpAssertQueryProgrammer_1.HttpAssertQueryProgrammer.write }));
})(HttpAssertQueryTransformer || (exports.HttpAssertQueryTransformer = HttpAssertQueryTransformer = {}));
//# sourceMappingURL=HttpAssertQueryTransformer.js.map