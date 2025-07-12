"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._httpFormDataReadBoolean = void 0;
const _httpFormDataReadBoolean = (input) => input instanceof File
    ? input
    : input === null
        ? undefined
        : input === "null"
            ? null
            : input.length === 0
                ? true
                : input === "true" || input === "1"
                    ? true
                    : input === "false" || input === "0"
                        ? false
                        : input; // wrong type
exports._httpFormDataReadBoolean = _httpFormDataReadBoolean;
//# sourceMappingURL=_httpFormDataReadBoolean.js.map