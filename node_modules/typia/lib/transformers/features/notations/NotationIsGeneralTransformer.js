"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotationIsGeneralTransformer = void 0;
const NotationIsGeneralProgrammer_1 = require("../../../programmers/notations/NotationIsGeneralProgrammer");
const StringUtil_1 = require("../../../utils/StringUtil");
const GenericTransformer_1 = require("../../internal/GenericTransformer");
var NotationIsGeneralTransformer;
(function (NotationIsGeneralTransformer) {
    NotationIsGeneralTransformer.transform = (rename) => (props) => GenericTransformer_1.GenericTransformer.scalar(Object.assign(Object.assign({}, props), { method: `notations.is${StringUtil_1.StringUtil.capitalize(rename.name)}`, write: (x) => NotationIsGeneralProgrammer_1.NotationIsGeneralProgrammer.write(Object.assign(Object.assign({}, x), { rename })) }));
})(NotationIsGeneralTransformer || (exports.NotationIsGeneralTransformer = NotationIsGeneralTransformer = {}));
//# sourceMappingURL=NotationIsGeneralTransformer.js.map