"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateHttpValidateFormDataTransformer = void 0;
const HttpValidateFormDataProgrammer_1 = require("../../../programmers/http/HttpValidateFormDataProgrammer");
const GenericTransformer_1 = require("../../internal/GenericTransformer");
var CreateHttpValidateFormDataTransformer;
(function (CreateHttpValidateFormDataTransformer) {
    CreateHttpValidateFormDataTransformer.transform = (props) => GenericTransformer_1.GenericTransformer.factory(Object.assign(Object.assign({}, props), { method: "http.createValidateFormData", write: HttpValidateFormDataProgrammer_1.HttpValidateFormDataProgrammer.write }));
})(CreateHttpValidateFormDataTransformer || (exports.CreateHttpValidateFormDataTransformer = CreateHttpValidateFormDataTransformer = {}));
//# sourceMappingURL=CreateHttpValidateFormDataTransformer.js.map