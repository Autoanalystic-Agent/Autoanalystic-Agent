"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiscAssertCloneTransformer = void 0;
const MiscAssertCloneProgrammer_1 = require("../../../programmers/misc/MiscAssertCloneProgrammer");
const GenericTransformer_1 = require("../../internal/GenericTransformer");
var MiscAssertCloneTransformer;
(function (MiscAssertCloneTransformer) {
    MiscAssertCloneTransformer.transform = (props) => GenericTransformer_1.GenericTransformer.scalar(Object.assign(Object.assign({}, props), { method: "misc.assertClone", write: MiscAssertCloneProgrammer_1.MiscAssertCloneProgrammer.write }));
})(MiscAssertCloneTransformer || (exports.MiscAssertCloneTransformer = MiscAssertCloneTransformer = {}));
//# sourceMappingURL=MiscAssertCloneTransformer.js.map