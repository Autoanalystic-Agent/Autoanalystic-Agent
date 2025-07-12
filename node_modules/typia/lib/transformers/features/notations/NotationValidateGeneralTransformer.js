"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotationValidateGeneralTransformer = void 0;
const NotationValidateGeneralProgrammer_1 = require("../../../programmers/notations/NotationValidateGeneralProgrammer");
const StringUtil_1 = require("../../../utils/StringUtil");
const GenericTransformer_1 = require("../../internal/GenericTransformer");
var NotationValidateGeneralTransformer;
(function (NotationValidateGeneralTransformer) {
    NotationValidateGeneralTransformer.transform = (rename) => (props) => GenericTransformer_1.GenericTransformer.scalar(Object.assign(Object.assign({}, props), { method: `notations.validate${StringUtil_1.StringUtil.capitalize(rename.name)}`, write: (x) => NotationValidateGeneralProgrammer_1.NotationValidateGeneralProgrammer.write(Object.assign(Object.assign({}, x), { rename })) }));
})(NotationValidateGeneralTransformer || (exports.NotationValidateGeneralTransformer = NotationValidateGeneralTransformer = {}));
//# sourceMappingURL=NotationValidateGeneralTransformer.js.map