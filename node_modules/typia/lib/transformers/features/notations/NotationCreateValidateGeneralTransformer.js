"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotationCreateValidateGeneralTransformer = void 0;
const NotationValidateGeneralProgrammer_1 = require("../../../programmers/notations/NotationValidateGeneralProgrammer");
const StringUtil_1 = require("../../../utils/StringUtil");
const GenericTransformer_1 = require("../../internal/GenericTransformer");
var NotationCreateValidateGeneralTransformer;
(function (NotationCreateValidateGeneralTransformer) {
    NotationCreateValidateGeneralTransformer.transform = (rename) => (props) => GenericTransformer_1.GenericTransformer.factory(Object.assign(Object.assign({}, props), { method: `notations.createValidate${StringUtil_1.StringUtil.capitalize(rename.name)}`, write: (x) => NotationValidateGeneralProgrammer_1.NotationValidateGeneralProgrammer.write(Object.assign(Object.assign({}, x), { rename })) }));
})(NotationCreateValidateGeneralTransformer || (exports.NotationCreateValidateGeneralTransformer = NotationCreateValidateGeneralTransformer = {}));
//# sourceMappingURL=NotationCreateValidateGeneralTransformer.js.map