"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._isTypeFloat = void 0;
const _isTypeFloat = (value) => MINIMUM <= value && value <= MAXIMUM;
exports._isTypeFloat = _isTypeFloat;
const MINIMUM = -1.175494351e38;
const MAXIMUM = 3.4028235e38;
//# sourceMappingURL=_isTypeFloat.js.map