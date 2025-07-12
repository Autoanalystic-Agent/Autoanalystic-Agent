"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpValidateFormDataTransformer = void 0;
const HttpValidateFormDataProgrammer_1 = require("../../../programmers/http/HttpValidateFormDataProgrammer");
const GenericTransformer_1 = require("../../internal/GenericTransformer");
var HttpValidateFormDataTransformer;
(function (HttpValidateFormDataTransformer) {
    HttpValidateFormDataTransformer.transform = (props) => GenericTransformer_1.GenericTransformer.scalar(Object.assign(Object.assign({}, props), { method: "http.validateFormData", write: HttpValidateFormDataProgrammer_1.HttpValidateFormDataProgrammer.write }));
})(HttpValidateFormDataTransformer || (exports.HttpValidateFormDataTransformer = HttpValidateFormDataTransformer = {}));
//# sourceMappingURL=HttpValidateFormDataTransformer.js.map