"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._httpParameterReadBoolean = void 0;
const _httpParameterReadBoolean = (value) => value !== "null"
    ? value === "true" || value === "1"
        ? true
        : value === "false" || value === "0"
            ? false
            : value
    : null;
exports._httpParameterReadBoolean = _httpParameterReadBoolean;
//# sourceMappingURL=_httpParameterReadBoolean.js.map