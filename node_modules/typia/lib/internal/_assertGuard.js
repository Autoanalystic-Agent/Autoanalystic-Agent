"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._assertGuard = void 0;
const TypeGuardError_1 = require("../TypeGuardError");
const _assertGuard = (exceptionable, props, factory) => {
    if (exceptionable === true) {
        if (factory)
            throw factory(props);
        else
            throw new TypeGuardError_1.TypeGuardError(props);
    }
    return false;
};
exports._assertGuard = _assertGuard;
//# sourceMappingURL=_assertGuard.js.map