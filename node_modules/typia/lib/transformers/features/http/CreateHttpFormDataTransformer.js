"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateHttpFormDataTransformer = void 0;
const HttpFormDataProgrammer_1 = require("../../../programmers/http/HttpFormDataProgrammer");
const GenericTransformer_1 = require("../../internal/GenericTransformer");
var CreateHttpFormDataTransformer;
(function (CreateHttpFormDataTransformer) {
    CreateHttpFormDataTransformer.transform = (props) => GenericTransformer_1.GenericTransformer.factory(Object.assign(Object.assign({}, props), { method: "http.createFormData", write: HttpFormDataProgrammer_1.HttpFormDataProgrammer.write }));
})(CreateHttpFormDataTransformer || (exports.CreateHttpFormDataTransformer = CreateHttpFormDataTransformer = {}));
//# sourceMappingURL=CreateHttpFormDataTransformer.js.map