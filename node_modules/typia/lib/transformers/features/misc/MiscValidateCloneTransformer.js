"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiscValidateCloneTransformer = void 0;
const MiscValidateCloneProgrammer_1 = require("../../../programmers/misc/MiscValidateCloneProgrammer");
const GenericTransformer_1 = require("../../internal/GenericTransformer");
var MiscValidateCloneTransformer;
(function (MiscValidateCloneTransformer) {
    MiscValidateCloneTransformer.transform = (props) => GenericTransformer_1.GenericTransformer.scalar(Object.assign(Object.assign({}, props), { method: "misc.validateClone", write: MiscValidateCloneProgrammer_1.MiscValidateCloneProgrammer.write }));
})(MiscValidateCloneTransformer || (exports.MiscValidateCloneTransformer = MiscValidateCloneTransformer = {}));
//# sourceMappingURL=MiscValidateCloneTransformer.js.map