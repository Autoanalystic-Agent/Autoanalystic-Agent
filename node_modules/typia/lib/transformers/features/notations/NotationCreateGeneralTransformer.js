"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotationCreateGeneralTransformer = void 0;
const NotationGeneralProgrammer_1 = require("../../../programmers/notations/NotationGeneralProgrammer");
const StringUtil_1 = require("../../../utils/StringUtil");
const GenericTransformer_1 = require("../../internal/GenericTransformer");
var NotationCreateGeneralTransformer;
(function (NotationCreateGeneralTransformer) {
    NotationCreateGeneralTransformer.transform = (rename) => (props) => GenericTransformer_1.GenericTransformer.factory(Object.assign(Object.assign({}, props), { method: `notations.create${StringUtil_1.StringUtil.capitalize(rename.name)}`, write: (x) => NotationGeneralProgrammer_1.NotationGeneralProgrammer.write(Object.assign(Object.assign({}, x), { rename })) }));
})(NotationCreateGeneralTransformer || (exports.NotationCreateGeneralTransformer = NotationCreateGeneralTransformer = {}));
//# sourceMappingURL=NotationCreateGeneralTransformer.js.map