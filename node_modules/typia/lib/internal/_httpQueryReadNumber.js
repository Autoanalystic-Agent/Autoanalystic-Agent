"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._httpQueryReadNumber = void 0;
const _httpQueryReadNumber = (str) => !!(str === null || str === void 0 ? void 0 : str.length) ? (str === "null" ? null : toNumber(str)) : undefined;
exports._httpQueryReadNumber = _httpQueryReadNumber;
const toNumber = (str) => {
    const value = Number(str);
    return isNaN(value) ? str : value;
};
//# sourceMappingURL=_httpQueryReadNumber.js.map