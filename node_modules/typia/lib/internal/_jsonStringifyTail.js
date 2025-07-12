"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._jsonStringifyTail = void 0;
const _jsonStringifyTail = (str) => str[str.length - 1] === "," ? str.substring(0, str.length - 1) : str;
exports._jsonStringifyTail = _jsonStringifyTail;
//# sourceMappingURL=_jsonStringifyTail.js.map