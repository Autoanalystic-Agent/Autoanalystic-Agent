"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiscCreateCloneTransformer = void 0;
const MiscCloneProgrammer_1 = require("../../../programmers/misc/MiscCloneProgrammer");
const GenericTransformer_1 = require("../../internal/GenericTransformer");
var MiscCreateCloneTransformer;
(function (MiscCreateCloneTransformer) {
    MiscCreateCloneTransformer.transform = (props) => GenericTransformer_1.GenericTransformer.factory(Object.assign(Object.assign({}, props), { method: "misc.createClone", write: MiscCloneProgrammer_1.MiscCloneProgrammer.write }));
})(MiscCreateCloneTransformer || (exports.MiscCreateCloneTransformer = MiscCreateCloneTransformer = {}));
//# sourceMappingURL=MiscCreateCloneTransformer.js.map