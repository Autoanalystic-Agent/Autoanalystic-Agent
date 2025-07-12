"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateHttpAssertHeadersTransformer = void 0;
const HttpAssertHeadersProgrammer_1 = require("../../../programmers/http/HttpAssertHeadersProgrammer");
const GenericTransformer_1 = require("../../internal/GenericTransformer");
var CreateHttpAssertHeadersTransformer;
(function (CreateHttpAssertHeadersTransformer) {
    CreateHttpAssertHeadersTransformer.transform = (props) => GenericTransformer_1.GenericTransformer.factory(Object.assign(Object.assign({}, props), { method: "http.createAssertHeaders", write: HttpAssertHeadersProgrammer_1.HttpAssertHeadersProgrammer.write }));
})(CreateHttpAssertHeadersTransformer || (exports.CreateHttpAssertHeadersTransformer = CreateHttpAssertHeadersTransformer = {}));
//# sourceMappingURL=CreateHttpAssertHeadersTransformer.js.map