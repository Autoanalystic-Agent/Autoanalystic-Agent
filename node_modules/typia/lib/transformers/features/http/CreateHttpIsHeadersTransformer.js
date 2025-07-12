"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateHttpIsHeadersTransformer = void 0;
const HttpIsHeadersProgrammer_1 = require("../../../programmers/http/HttpIsHeadersProgrammer");
const GenericTransformer_1 = require("../../internal/GenericTransformer");
var CreateHttpIsHeadersTransformer;
(function (CreateHttpIsHeadersTransformer) {
    CreateHttpIsHeadersTransformer.transform = (props) => GenericTransformer_1.GenericTransformer.factory(Object.assign(Object.assign({}, props), { method: "http.createIsHeaders", write: HttpIsHeadersProgrammer_1.HttpIsHeadersProgrammer.write }));
})(CreateHttpIsHeadersTransformer || (exports.CreateHttpIsHeadersTransformer = CreateHttpIsHeadersTransformer = {}));
//# sourceMappingURL=CreateHttpIsHeadersTransformer.js.map