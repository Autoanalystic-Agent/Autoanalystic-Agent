"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._httpHeaderReadNumber = void 0;
const _httpHeaderReadNumber = (value) => value !== undefined ? toNumber(value) : undefined;
exports._httpHeaderReadNumber = _httpHeaderReadNumber;
const toNumber = (str) => {
    const value = Number(str);
    return isNaN(value) ? str : value;
};
//# sourceMappingURL=_httpHeaderReadNumber.js.map