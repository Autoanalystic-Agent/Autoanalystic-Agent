"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiscIsCloneTransformer = void 0;
const MiscIsCloneProgrammer_1 = require("../../../programmers/misc/MiscIsCloneProgrammer");
const GenericTransformer_1 = require("../../internal/GenericTransformer");
var MiscIsCloneTransformer;
(function (MiscIsCloneTransformer) {
    MiscIsCloneTransformer.transform = (props) => GenericTransformer_1.GenericTransformer.scalar(Object.assign(Object.assign({}, props), { method: "misc.isClone", write: MiscIsCloneProgrammer_1.MiscIsCloneProgrammer.write }));
})(MiscIsCloneTransformer || (exports.MiscIsCloneTransformer = MiscIsCloneTransformer = {}));
//# sourceMappingURL=MiscIsCloneTransformer.js.map