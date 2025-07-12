"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._isTypeInt64 = void 0;
const _isTypeInt64 = (value) => Math.floor(value) === value && MINIMUM <= value && value <= MAXIMUM;
exports._isTypeInt64 = _isTypeInt64;
const MINIMUM = -(Math.pow(2, 63));
const MAXIMUM = Math.pow(2, 63) - 1;
//# sourceMappingURL=_isTypeInt64.js.map