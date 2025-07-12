"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpIsFormDataTransformer = void 0;
const HttpIsFormDataProgrammer_1 = require("../../../programmers/http/HttpIsFormDataProgrammer");
const GenericTransformer_1 = require("../../internal/GenericTransformer");
var HttpIsFormDataTransformer;
(function (HttpIsFormDataTransformer) {
    HttpIsFormDataTransformer.transform = (props) => GenericTransformer_1.GenericTransformer.scalar(Object.assign(Object.assign({}, props), { method: "http.isFormData", write: HttpIsFormDataProgrammer_1.HttpIsFormDataProgrammer.write }));
})(HttpIsFormDataTransformer || (exports.HttpIsFormDataTransformer = HttpIsFormDataTransformer = {}));
//# sourceMappingURL=HttpIsFormDataTransformer.js.map