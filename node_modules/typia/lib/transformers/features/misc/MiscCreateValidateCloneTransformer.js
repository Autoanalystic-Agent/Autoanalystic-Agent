"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiscCreateValidateCloneTransformer = void 0;
const MiscValidateCloneProgrammer_1 = require("../../../programmers/misc/MiscValidateCloneProgrammer");
const GenericTransformer_1 = require("../../internal/GenericTransformer");
var MiscCreateValidateCloneTransformer;
(function (MiscCreateValidateCloneTransformer) {
    MiscCreateValidateCloneTransformer.transform = (props) => GenericTransformer_1.GenericTransformer.factory(Object.assign(Object.assign({}, props), { method: "misc.createValidateClone", write: MiscValidateCloneProgrammer_1.MiscValidateCloneProgrammer.write }));
})(MiscCreateValidateCloneTransformer || (exports.MiscCreateValidateCloneTransformer = MiscCreateValidateCloneTransformer = {}));
//# sourceMappingURL=MiscCreateValidateCloneTransformer.js.map