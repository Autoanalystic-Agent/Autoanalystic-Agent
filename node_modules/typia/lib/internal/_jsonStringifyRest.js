"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._jsonStringifyRest = void 0;
const _jsonStringifyRest = (str) => {
    return str.length === 2 ? "" : "," + str.substring(1, str.length - 1);
};
exports._jsonStringifyRest = _jsonStringifyRest;
//# sourceMappingURL=_jsonStringifyRest.js.map