"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotationGeneralTransformer = void 0;
const NotationGeneralProgrammer_1 = require("../../../programmers/notations/NotationGeneralProgrammer");
const GenericTransformer_1 = require("../../internal/GenericTransformer");
var NotationGeneralTransformer;
(function (NotationGeneralTransformer) {
    NotationGeneralTransformer.transform = (rename) => (props) => GenericTransformer_1.GenericTransformer.scalar(Object.assign(Object.assign({}, props), { method: `notations.${rename.name}`, write: (x) => NotationGeneralProgrammer_1.NotationGeneralProgrammer.write(Object.assign(Object.assign({}, x), { rename })) }));
})(NotationGeneralTransformer || (exports.NotationGeneralTransformer = NotationGeneralTransformer = {}));
//# sourceMappingURL=NotationGeneralTransformer.js.map