"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateHttpParameterTransformer = void 0;
const HttpParameterProgrammer_1 = require("../../../programmers/http/HttpParameterProgrammer");
const GenericTransformer_1 = require("../../internal/GenericTransformer");
var CreateHttpParameterTransformer;
(function (CreateHttpParameterTransformer) {
    CreateHttpParameterTransformer.transform = (props) => GenericTransformer_1.GenericTransformer.factory(Object.assign(Object.assign({}, props), { method: "http.createParameter", write: HttpParameterProgrammer_1.HttpParameterProgrammer.write }));
})(CreateHttpParameterTransformer || (exports.CreateHttpParameterTransformer = CreateHttpParameterTransformer = {}));
//# sourceMappingURL=CreateHttpParameterTransformer.js.map