"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._httpFormDataReadBigint = void 0;
const _httpFormDataReadBigint = (input) => input instanceof File
    ? input
    : !!(input === null || input === void 0 ? void 0 : input.length)
        ? input === "null"
            ? null
            : toBigint(input)
        : undefined;
exports._httpFormDataReadBigint = _httpFormDataReadBigint;
const toBigint = (str) => {
    try {
        return BigInt(str);
    }
    catch (_a) {
        return str;
    }
};
//# sourceMappingURL=_httpFormDataReadBigint.js.map