"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotationCreateIsGeneralTransformer = void 0;
const NotationIsGeneralProgrammer_1 = require("../../../programmers/notations/NotationIsGeneralProgrammer");
const StringUtil_1 = require("../../../utils/StringUtil");
const GenericTransformer_1 = require("../../internal/GenericTransformer");
var NotationCreateIsGeneralTransformer;
(function (NotationCreateIsGeneralTransformer) {
    NotationCreateIsGeneralTransformer.transform = (rename) => (props) => GenericTransformer_1.GenericTransformer.factory(Object.assign(Object.assign({}, props), { method: `notations.createIs${StringUtil_1.StringUtil.capitalize(rename.name)}`, write: (x) => NotationIsGeneralProgrammer_1.NotationIsGeneralProgrammer.write(Object.assign(Object.assign({}, x), { rename })) }));
})(NotationCreateIsGeneralTransformer || (exports.NotationCreateIsGeneralTransformer = NotationCreateIsGeneralTransformer = {}));
//# sourceMappingURL=NotationCreateIsGeneralTransformer.js.map