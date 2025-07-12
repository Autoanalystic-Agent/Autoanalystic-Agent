"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._httpFormDataReadString = void 0;
const _httpFormDataReadString = (input) => input instanceof File
    ? input
    : input === null
        ? undefined
        : input === "null"
            ? null
            : input;
exports._httpFormDataReadString = _httpFormDataReadString;
//# sourceMappingURL=_httpFormDataReadString.js.map