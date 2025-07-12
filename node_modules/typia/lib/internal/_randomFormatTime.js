"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._randomFormatTime = void 0;
const _randomInteger_1 = require("./_randomInteger");
const _randomFormatTime = () => new Date((0, _randomInteger_1._randomInteger)({
    type: "integer",
    minimum: 0,
    maximum: DAY,
}))
    .toISOString()
    .substring(11);
exports._randomFormatTime = _randomFormatTime;
const DAY = 86400000;
//# sourceMappingURL=_randomFormatTime.js.map