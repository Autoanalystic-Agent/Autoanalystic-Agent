"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._randomFormatEmail = void 0;
const _randomString_1 = require("./_randomString");
const _randomFormatEmail = () => `${random(10)}@${random(10)}.${random(3)}`;
exports._randomFormatEmail = _randomFormatEmail;
const random = (length) => (0, _randomString_1._randomString)({
    type: "string",
    minLength: length,
    maxLength: length,
});
//# sourceMappingURL=_randomFormatEmail.js.map