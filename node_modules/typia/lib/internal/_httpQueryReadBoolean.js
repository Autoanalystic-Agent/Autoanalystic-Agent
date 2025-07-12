"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._httpQueryReadBoolean = void 0;
const _httpQueryReadBoolean = (str) => str === null
    ? undefined
    : str === "null"
        ? null
        : str.length === 0
            ? true
            : str === "true" || str === "1"
                ? true
                : str === "false" || str === "0"
                    ? false
                    : str; // wrong type
exports._httpQueryReadBoolean = _httpQueryReadBoolean;
//# sourceMappingURL=_httpQueryReadBoolean.js.map