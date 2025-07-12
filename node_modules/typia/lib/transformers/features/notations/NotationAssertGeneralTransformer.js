"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotationAssertGeneralTransformer = void 0;
const NotationAssertGeneralProgrammer_1 = require("../../../programmers/notations/NotationAssertGeneralProgrammer");
const StringUtil_1 = require("../../../utils/StringUtil");
const GenericTransformer_1 = require("../../internal/GenericTransformer");
var NotationAssertGeneralTransformer;
(function (NotationAssertGeneralTransformer) {
    NotationAssertGeneralTransformer.transform = (rename) => (props) => GenericTransformer_1.GenericTransformer.scalar(Object.assign(Object.assign({}, props), { method: `notations.assert${StringUtil_1.StringUtil.capitalize(rename.name)}`, write: (x) => NotationAssertGeneralProgrammer_1.NotationAssertGeneralProgrammer.write(Object.assign(Object.assign({}, x), { rename })) }));
})(NotationAssertGeneralTransformer || (exports.NotationAssertGeneralTransformer = NotationAssertGeneralTransformer = {}));
//# sourceMappingURL=NotationAssertGeneralTransformer.js.map