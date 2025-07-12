"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateValidateTransformer = void 0;
const ValidateProgrammer_1 = require("../../programmers/ValidateProgrammer");
const GenericTransformer_1 = require("../internal/GenericTransformer");
var CreateValidateTransformer;
(function (CreateValidateTransformer) {
    CreateValidateTransformer.transform = (config) => (props) => GenericTransformer_1.GenericTransformer.factory(Object.assign(Object.assign({}, props), { method: config.equals ? "validateEquals" : "validate", write: (x) => ValidateProgrammer_1.ValidateProgrammer.write(Object.assign(Object.assign({}, x), { config })) }));
})(CreateValidateTransformer || (exports.CreateValidateTransformer = CreateValidateTransformer = {}));
//# sourceMappingURL=CreateValidateTransformer.js.map