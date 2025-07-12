"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiscIsPruneTransformer = void 0;
const MiscIsPruneProgrammer_1 = require("../../../programmers/misc/MiscIsPruneProgrammer");
const GenericTransformer_1 = require("../../internal/GenericTransformer");
var MiscIsPruneTransformer;
(function (MiscIsPruneTransformer) {
    MiscIsPruneTransformer.transform = (props) => GenericTransformer_1.GenericTransformer.scalar(Object.assign(Object.assign({}, props), { method: "misc.isPrune", write: MiscIsPruneProgrammer_1.MiscIsPruneProgrammer.write }));
})(MiscIsPruneTransformer || (exports.MiscIsPruneTransformer = MiscIsPruneTransformer = {}));
//# sourceMappingURL=MiscIsPruneTransformer.js.map