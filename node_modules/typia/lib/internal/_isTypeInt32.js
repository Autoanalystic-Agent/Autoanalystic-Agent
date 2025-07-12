"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._isTypeInt32 = void 0;
const _isTypeInt32 = (value) => Math.floor(value) === value && MINIMUM <= value && value <= MAXIMUM;
exports._isTypeInt32 = _isTypeInt32;
const MINIMUM = -(Math.pow(2, 31));
const MAXIMUM = Math.pow(2, 31) - 1;
//# sourceMappingURL=_isTypeInt32.js.map