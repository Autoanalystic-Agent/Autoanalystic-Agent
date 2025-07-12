"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiscCloneTransformer = void 0;
const MiscCloneProgrammer_1 = require("../../../programmers/misc/MiscCloneProgrammer");
const GenericTransformer_1 = require("../../internal/GenericTransformer");
var MiscCloneTransformer;
(function (MiscCloneTransformer) {
    MiscCloneTransformer.transform = (props) => GenericTransformer_1.GenericTransformer.scalar(Object.assign(Object.assign({}, props), { method: "misc.clone", write: MiscCloneProgrammer_1.MiscCloneProgrammer.write }));
})(MiscCloneTransformer || (exports.MiscCloneTransformer = MiscCloneTransformer = {}));
//# sourceMappingURL=MiscCloneTransformer.js.map