"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._httpHeaderReadBigint = void 0;
const _httpHeaderReadBigint = (value) => value !== undefined ? toBigint(value) : undefined;
exports._httpHeaderReadBigint = _httpHeaderReadBigint;
const toBigint = (str) => {
    try {
        return BigInt(str);
    }
    catch (_a) {
        return str;
    }
};
//# sourceMappingURL=_httpHeaderReadBigint.js.map