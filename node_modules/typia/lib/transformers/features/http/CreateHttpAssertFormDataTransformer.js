"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateHttpAssertFormDataTransformer = void 0;
const HttpAssertFormDataProgrammer_1 = require("../../../programmers/http/HttpAssertFormDataProgrammer");
const GenericTransformer_1 = require("../../internal/GenericTransformer");
var CreateHttpAssertFormDataTransformer;
(function (CreateHttpAssertFormDataTransformer) {
    CreateHttpAssertFormDataTransformer.transform = (props) => GenericTransformer_1.GenericTransformer.factory(Object.assign(Object.assign({}, props), { method: "http.createAssertFormData", write: HttpAssertFormDataProgrammer_1.HttpAssertFormDataProgrammer.write }));
})(CreateHttpAssertFormDataTransformer || (exports.CreateHttpAssertFormDataTransformer = CreateHttpAssertFormDataTransformer = {}));
//# sourceMappingURL=CreateHttpAssertFormDataTransformer.js.map