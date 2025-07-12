"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._isFormatIpv4 = void 0;
const _isFormatIpv4 = (str) => PATTERN.test(str);
exports._isFormatIpv4 = _isFormatIpv4;
const PATTERN = /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/;
//# sourceMappingURL=_isFormatIpv4.js.map