"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._isFormatRegex = void 0;
const _isFormatRegex = (str) => {
    try {
        new RegExp(str);
        return true;
    }
    catch (_a) {
        return false;
    }
};
exports._isFormatRegex = _isFormatRegex;
