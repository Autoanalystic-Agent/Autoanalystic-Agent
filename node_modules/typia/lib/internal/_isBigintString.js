"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._isBigintString = void 0;
const _isBigintString = (str) => {
    try {
        BigInt(str);
        return true;
    }
    catch (_a) {
        return false;
    }
};
exports._isBigintString = _isBigintString;
//# sourceMappingURL=_isBigintString.js.map