"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._randomFormatRelativeJsonPointer = void 0;
const _randomInteger_1 = require("./_randomInteger");
const _randomFormatRelativeJsonPointer = () => `${(0, _randomInteger_1._randomInteger)({
    type: "integer",
    minimum: 0,
    maximum: 10,
})}#`;
exports._randomFormatRelativeJsonPointer = _randomFormatRelativeJsonPointer;
//# sourceMappingURL=_randomFormatRelativeJsonPointer.js.map