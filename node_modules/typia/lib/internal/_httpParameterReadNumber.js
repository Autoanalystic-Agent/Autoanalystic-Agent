"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._httpParameterReadNumber = void 0;
const _httpParameterReadNumber = (value) => value !== "null" ? toNumber(value) : null;
exports._httpParameterReadNumber = _httpParameterReadNumber;
const toNumber = (str) => {
    const value = Number(str);
    return isNaN(value) ? str : value;
};
//# sourceMappingURL=_httpParameterReadNumber.js.map