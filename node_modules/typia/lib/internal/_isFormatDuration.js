"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._isFormatDuration = void 0;
const _isFormatDuration = (str) => PATTERN.test(str);
exports._isFormatDuration = _isFormatDuration;
const PATTERN = /^P(?!$)((\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?|(\d+W)?)$/;
//# sourceMappingURL=_isFormatDuration.js.map