"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._jsonStringifyNumber = void 0;
const TypeGuardError_1 = require("../TypeGuardError");
const _jsonStringifyNumber = (value) => {
    if (isFinite(value) === false)
        throw new TypeGuardError_1.TypeGuardError({
            method: "typia.json.stringify",
            expected: "number",
            value,
            message: "Error on typia.json.stringify(): infinite or not a number.",
        });
    return value;
};
exports._jsonStringifyNumber = _jsonStringifyNumber;
//# sourceMappingURL=_jsonStringifyNumber.js.map