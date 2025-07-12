"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._httpHeaderReadBoolean = void 0;
const _httpHeaderReadBoolean = (value) => value !== undefined
    ? value === "true"
        ? true
        : value === "false"
            ? false
            : value
    : undefined;
exports._httpHeaderReadBoolean = _httpHeaderReadBoolean;
//# sourceMappingURL=_httpHeaderReadBoolean.js.map