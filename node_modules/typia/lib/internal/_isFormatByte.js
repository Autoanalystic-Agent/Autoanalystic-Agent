"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._isFormatByte = void 0;
const _isFormatByte = (str) => {
    PATTERN.lastIndex = 0;
    return PATTERN.test(str);
};
exports._isFormatByte = _isFormatByte;
const PATTERN = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/gm;
//# sourceMappingURL=_isFormatByte.js.map