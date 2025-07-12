"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._randomPick = void 0;
const _randomInteger_1 = require("./_randomInteger");
const _randomPick = (array) => array[random(array)];
exports._randomPick = _randomPick;
const random = (array) => (0, _randomInteger_1._randomInteger)({
    type: "integer",
    minimum: 0,
    maximum: array.length - 1,
});
//# sourceMappingURL=_randomPick.js.map