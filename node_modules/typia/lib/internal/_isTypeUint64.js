"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._isTypeUint64 = void 0;
const _isTypeUint64 = (value) => Math.floor(value) === value && MINIMUM <= value && value <= MAXIMUM;
exports._isTypeUint64 = _isTypeUint64;
const MINIMUM = 0;
const MAXIMUM = Math.pow(2, 64) - 1;
//# sourceMappingURL=_isTypeUint64.js.map