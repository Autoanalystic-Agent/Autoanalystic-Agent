"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiscCreatePruneTransformer = void 0;
const MiscPruneProgrammer_1 = require("../../../programmers/misc/MiscPruneProgrammer");
const GenericTransformer_1 = require("../../internal/GenericTransformer");
var MiscCreatePruneTransformer;
(function (MiscCreatePruneTransformer) {
    MiscCreatePruneTransformer.transform = (props) => GenericTransformer_1.GenericTransformer.factory(Object.assign(Object.assign({}, props), { method: "misc.createPrune", write: MiscPruneProgrammer_1.MiscPruneProgrammer.write }));
})(MiscCreatePruneTransformer || (exports.MiscCreatePruneTransformer = MiscCreatePruneTransformer = {}));
//# sourceMappingURL=MiscCreatePruneTransformer.js.map