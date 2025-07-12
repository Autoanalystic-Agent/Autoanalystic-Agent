"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._httpParameterReadBigint = void 0;
const _httpParameterReadBigint = (value) => value !== "null" ? toBigint(value) : null;
exports._httpParameterReadBigint = _httpParameterReadBigint;
const toBigint = (str) => {
    try {
        return BigInt(str);
    }
    catch (_a) {
        return str;
    }
};
//# sourceMappingURL=_httpParameterReadBigint.js.map