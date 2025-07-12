"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiscValidatePruneTransformer = void 0;
const MiscValidatePruneProgrammer_1 = require("../../../programmers/misc/MiscValidatePruneProgrammer");
const GenericTransformer_1 = require("../../internal/GenericTransformer");
var MiscValidatePruneTransformer;
(function (MiscValidatePruneTransformer) {
    MiscValidatePruneTransformer.transform = (props) => GenericTransformer_1.GenericTransformer.scalar(Object.assign(Object.assign({}, props), { method: "misc.validatePrune", write: MiscValidatePruneProgrammer_1.MiscValidatePruneProgrammer.write }));
})(MiscValidatePruneTransformer || (exports.MiscValidatePruneTransformer = MiscValidatePruneTransformer = {}));
//# sourceMappingURL=MiscValidatePruneTransformer.js.map