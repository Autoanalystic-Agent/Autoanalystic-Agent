"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateTransformer = void 0;
const ValidateProgrammer_1 = require("../../programmers/ValidateProgrammer");
const GenericTransformer_1 = require("../internal/GenericTransformer");
var ValidateTransformer;
(function (ValidateTransformer) {
    ValidateTransformer.transform = (config) => (props) => GenericTransformer_1.GenericTransformer.scalar(Object.assign(Object.assign({}, props), { method: config.equals ? "validateEquals" : "validate", write: (x) => ValidateProgrammer_1.ValidateProgrammer.write(Object.assign(Object.assign({}, x), { config })) }));
})(ValidateTransformer || (exports.ValidateTransformer = ValidateTransformer = {}));
//# sourceMappingURL=ValidateTransformer.js.map