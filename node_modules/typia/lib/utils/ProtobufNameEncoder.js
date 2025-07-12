"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtobufNameEncoder = void 0;
var ProtobufNameEncoder;
(function (ProtobufNameEncoder) {
    ProtobufNameEncoder.encode = (str) => {
        for (const [before, after] of REPLACERS)
            str = str.split(before).join(after);
        return str;
    };
    ProtobufNameEncoder.decode = (str) => {
        for (const [before, after] of REPLACERS)
            if (after !== "")
                str = str.split(after).join(before);
        return str;
    };
})(ProtobufNameEncoder || (exports.ProtobufNameEncoder = ProtobufNameEncoder = {}));
const REPLACERS = [
    ["$", "_dollar_"],
    ["&", "_and_"],
    ["|", "_or_"],
    ["{", "_blt_"],
    ["}", "_bgt_"],
    ["<", "_lt_"],
    [">", "_gt_"],
    ["(", "_lp_"],
    [")", "_rp_"],
    ["[", "_alt_"],
    ["]", "_agt_"],
    [",", "_comma_"],
    ["`", "_backquote_"],
    ["'", "_singlequote_"],
    ['"', "_doublequote_"],
    [" ", "_space_"],
];
//# sourceMappingURL=ProtobufNameEncoder.js.map