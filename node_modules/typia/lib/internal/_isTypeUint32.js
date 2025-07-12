"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._isTypeUint32 = void 0;
const _isTypeUint32 = (value) => Math.floor(value) === value && MINIMUM <= value && value <= MAXIMUM;
exports._isTypeUint32 = _isTypeUint32;
const MINIMUM = 0;
const MAXIMUM = Math.pow(2, 32) - 1;
//# sourceMappingURL=_isTypeUint32.js.map