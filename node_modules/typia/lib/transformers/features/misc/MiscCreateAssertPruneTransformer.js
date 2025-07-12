"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiscCreateAssertPruneTransformer = void 0;
const MiscAssertPruneProgrammer_1 = require("../../../programmers/misc/MiscAssertPruneProgrammer");
const GenericTransformer_1 = require("../../internal/GenericTransformer");
var MiscCreateAssertPruneTransformer;
(function (MiscCreateAssertPruneTransformer) {
    MiscCreateAssertPruneTransformer.transform = (props) => GenericTransformer_1.GenericTransformer.factory(Object.assign(Object.assign({}, props), { method: "misc.createAssertPrune", write: MiscAssertPruneProgrammer_1.MiscAssertPruneProgrammer.write }));
})(MiscCreateAssertPruneTransformer || (exports.MiscCreateAssertPruneTransformer = MiscCreateAssertPruneTransformer = {}));
//# sourceMappingURL=MiscCreateAssertPruneTransformer.js.map