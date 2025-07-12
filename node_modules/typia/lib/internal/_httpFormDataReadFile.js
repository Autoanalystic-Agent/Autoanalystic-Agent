"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._httpFormDataReadFile = void 0;
const _httpFormDataReadFile = (input) => input instanceof File
    ? input
    : input === null
        ? undefined
        : input === "null"
            ? null
            : input;
exports._httpFormDataReadFile = _httpFormDataReadFile;
//# sourceMappingURL=_httpFormDataReadFile.js.map