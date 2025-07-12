"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._randomString = void 0;
const _randomInteger_1 = require("./_randomInteger");
const _randomString = (props) => {
    var _a;
    const length = (0, _randomInteger_1._randomInteger)({
        type: "integer",
        minimum: (_a = props.minLength) !== null && _a !== void 0 ? _a : 0,
        maximum: props.maxLength,
    });
    return new Array(length)
        .fill(0)
        .map(() => ALPHABETS[random()])
        .join("");
};
exports._randomString = _randomString;
const ALPHABETS = "abcdefghijklmnopqrstuvwxyz";
const random = () => (0, _randomInteger_1._randomInteger)({
    type: "integer",
    minimum: 0,
    maximum: ALPHABETS.length - 1,
});
//# sourceMappingURL=_randomString.js.map