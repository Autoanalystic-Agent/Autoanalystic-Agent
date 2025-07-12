"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateHttpHeadersTransformer = void 0;
const HttpHeadersProgrammer_1 = require("../../../programmers/http/HttpHeadersProgrammer");
const GenericTransformer_1 = require("../../internal/GenericTransformer");
var CreateHttpHeadersTransformer;
(function (CreateHttpHeadersTransformer) {
    CreateHttpHeadersTransformer.transform = (props) => GenericTransformer_1.GenericTransformer.factory(Object.assign(Object.assign({}, props), { method: "http.createHeaders", write: HttpHeadersProgrammer_1.HttpHeadersProgrammer.write }));
})(CreateHttpHeadersTransformer || (exports.CreateHttpHeadersTransformer = CreateHttpHeadersTransformer = {}));
//# sourceMappingURL=CreateHttpHeadersTransformer.js.map