"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._randomArray = void 0;
const _randomInteger_1 = require("./_randomInteger");
const _randomArray = (props) => {
    var _a, _b, _c;
    const count = (0, _randomInteger_1._randomInteger)({
        type: "integer",
        minimum: (_a = props.minItems) !== null && _a !== void 0 ? _a : 0,
        maximum: (_b = props.maxItems) !== null && _b !== void 0 ? _b : ((_c = props.minItems) !== null && _c !== void 0 ? _c : 0) + 5,
    });
    if (props.uniqueItems !== true)
        return new Array(count).fill(null).map((_, i) => props.element(i, count));
    const elements = new Set();
    while (elements.size !== count)
        elements.add(props.element(elements.size, count));
    return Array.from(elements);
};
exports._randomArray = _randomArray;
//# sourceMappingURL=_randomArray.js.map