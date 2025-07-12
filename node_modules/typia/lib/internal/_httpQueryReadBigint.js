"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._httpQueryReadBigint = void 0;
const _httpQueryReadBigint = (str) => !!(str === null || str === void 0 ? void 0 : str.length) ? (str === "null" ? null : toBigint(str)) : undefined;
exports._httpQueryReadBigint = _httpQueryReadBigint;
const toBigint = (str) => {
    try {
        return BigInt(str);
    }
    catch (_a) {
        return str;
    }
};
//# sourceMappingURL=_httpQueryReadBigint.js.map