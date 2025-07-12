"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._httpFormDataReadNumber = void 0;
const _httpFormDataReadNumber = (input) => input instanceof File
    ? input
    : !!(input === null || input === void 0 ? void 0 : input.length)
        ? input === "null"
            ? null
            : toNumber(input)
        : undefined;
exports._httpFormDataReadNumber = _httpFormDataReadNumber;
const toNumber = (str) => {
    const value = Number(str);
    return isNaN(value) ? str : value;
};
//# sourceMappingURL=_httpFormDataReadNumber.js.map