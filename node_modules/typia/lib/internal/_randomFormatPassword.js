"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._randomFormatPassword = void 0;
const _randomString_1 = require("./_randomString");
const _randomFormatPassword = () => (0, _randomString_1._randomString)({
    type: "string",
    minLength: 4,
    maxLength: 16,
});
exports._randomFormatPassword = _randomFormatPassword;
//# sourceMappingURL=_randomFormatPassword.js.map