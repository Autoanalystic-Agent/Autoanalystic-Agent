"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpFormDataTransformer = void 0;
const HttpFormDataProgrammer_1 = require("../../../programmers/http/HttpFormDataProgrammer");
const GenericTransformer_1 = require("../../internal/GenericTransformer");
var HttpFormDataTransformer;
(function (HttpFormDataTransformer) {
    HttpFormDataTransformer.transform = (props) => GenericTransformer_1.GenericTransformer.scalar(Object.assign(Object.assign({}, props), { method: "http.formdata", write: HttpFormDataProgrammer_1.HttpFormDataProgrammer.write }));
})(HttpFormDataTransformer || (exports.HttpFormDataTransformer = HttpFormDataTransformer = {}));
//# sourceMappingURL=HttpFormDataTransformer.js.map