"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._isFormatDateTime = void 0;
const _isFormatDateTime = (str) => PATTERN.test(str);
exports._isFormatDateTime = _isFormatDateTime;
const PATTERN = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])(T|\s)([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](?:\.[0-9]{1,9})?(Z|[+-]([01][0-9]|2[0-3]):[0-5][0-9])$/i;
//# sourceMappingURL=_isFormatDateTime.js.map