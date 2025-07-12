"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringUtil = void 0;
var StringUtil;
(function (StringUtil) {
    StringUtil.capitalize = (str) => str.length ? str[0].toUpperCase() + str.slice(1).toLowerCase() : str;
    StringUtil.escapeDuplicate = (props) => {
        var _a;
        return props.keep.includes(props.input)
            ? StringUtil.escapeDuplicate({
                keep: props.keep,
                input: ((_a = props.escape) !== null && _a !== void 0 ? _a : ((str) => `_${str}`))(props.input),
            })
            : props.input;
    };
})(StringUtil || (exports.StringUtil = StringUtil = {}));
//# sourceMappingURL=StringUtil.js.map