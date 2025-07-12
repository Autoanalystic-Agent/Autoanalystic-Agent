"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._httpFormDataReadBlob = void 0;
const _httpFormDataReadBlob = (input) => input instanceof Blob
    ? input
    : input === null
        ? undefined
        : input === "null"
            ? null
            : input;
exports._httpFormDataReadBlob = _httpFormDataReadBlob;
//# sourceMappingURL=_httpFormDataReadBlob.js.map