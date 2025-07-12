"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpHeadersTransformer = void 0;
const HttpHeadersProgrammer_1 = require("../../../programmers/http/HttpHeadersProgrammer");
const GenericTransformer_1 = require("../../internal/GenericTransformer");
var HttpHeadersTransformer;
(function (HttpHeadersTransformer) {
    HttpHeadersTransformer.transform = (props) => GenericTransformer_1.GenericTransformer.scalar(Object.assign(Object.assign({}, props), { method: "http.headers", write: HttpHeadersProgrammer_1.HttpHeadersProgrammer.write }));
})(HttpHeadersTransformer || (exports.HttpHeadersTransformer = HttpHeadersTransformer = {}));
//# sourceMappingURL=HttpHeadersTransformer.js.map