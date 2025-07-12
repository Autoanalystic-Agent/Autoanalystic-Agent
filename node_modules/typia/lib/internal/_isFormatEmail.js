"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._isFormatEmail = void 0;
const _isFormatEmail = (str) => PATTERN.test(str);
exports._isFormatEmail = _isFormatEmail;
const PATTERN = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
//# sourceMappingURL=_isFormatEmail.js.map