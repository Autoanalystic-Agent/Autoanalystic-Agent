"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpIsHeadersTransformer = void 0;
const HttpIsHeadersProgrammer_1 = require("../../../programmers/http/HttpIsHeadersProgrammer");
const GenericTransformer_1 = require("../../internal/GenericTransformer");
var HttpIsHeadersTransformer;
(function (HttpIsHeadersTransformer) {
    HttpIsHeadersTransformer.transform = (props) => GenericTransformer_1.GenericTransformer.scalar(Object.assign(Object.assign({}, props), { method: "http.isHeaders", write: HttpIsHeadersProgrammer_1.HttpIsHeadersProgrammer.write }));
})(HttpIsHeadersTransformer || (exports.HttpIsHeadersTransformer = HttpIsHeadersTransformer = {}));
//# sourceMappingURL=HttpIsHeadersTransformer.js.map