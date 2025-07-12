"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotationCreateAssertGeneralTransformer = void 0;
const NotationAssertGeneralProgrammer_1 = require("../../../programmers/notations/NotationAssertGeneralProgrammer");
const StringUtil_1 = require("../../../utils/StringUtil");
const GenericTransformer_1 = require("../../internal/GenericTransformer");
var NotationCreateAssertGeneralTransformer;
(function (NotationCreateAssertGeneralTransformer) {
    NotationCreateAssertGeneralTransformer.transform = (rename) => (props) => GenericTransformer_1.GenericTransformer.factory(Object.assign(Object.assign({}, props), { method: `notations.createAssert${StringUtil_1.StringUtil.capitalize(rename.name)}`, write: (x) => NotationAssertGeneralProgrammer_1.NotationAssertGeneralProgrammer.write(Object.assign(Object.assign({}, x), { rename })) }));
})(NotationCreateAssertGeneralTransformer || (exports.NotationCreateAssertGeneralTransformer = NotationCreateAssertGeneralTransformer = {}));
//# sourceMappingURL=NotationCreateAssertGeneralTransformer.js.map