"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiscCreateAssertCloneTransformer = void 0;
const MiscAssertCloneProgrammer_1 = require("../../../programmers/misc/MiscAssertCloneProgrammer");
const GenericTransformer_1 = require("../../internal/GenericTransformer");
var MiscCreateAssertCloneTransformer;
(function (MiscCreateAssertCloneTransformer) {
    MiscCreateAssertCloneTransformer.transform = (props) => GenericTransformer_1.GenericTransformer.factory(Object.assign(Object.assign({}, props), { method: "misc.createAssertClone", write: MiscAssertCloneProgrammer_1.MiscAssertCloneProgrammer.write }));
})(MiscCreateAssertCloneTransformer || (exports.MiscCreateAssertCloneTransformer = MiscCreateAssertCloneTransformer = {}));
//# sourceMappingURL=MiscCreateAssertCloneTransformer.js.map