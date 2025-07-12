"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpAssertHeadersTransformer = void 0;
const HttpAssertHeadersProgrammer_1 = require("../../../programmers/http/HttpAssertHeadersProgrammer");
const GenericTransformer_1 = require("../../internal/GenericTransformer");
var HttpAssertHeadersTransformer;
(function (HttpAssertHeadersTransformer) {
    HttpAssertHeadersTransformer.transform = (props) => GenericTransformer_1.GenericTransformer.scalar(Object.assign(Object.assign({}, props), { method: "http.assertHeaders", write: HttpAssertHeadersProgrammer_1.HttpAssertHeadersProgrammer.write }));
})(HttpAssertHeadersTransformer || (exports.HttpAssertHeadersTransformer = HttpAssertHeadersTransformer = {}));
//# sourceMappingURL=HttpAssertHeadersTransformer.js.map