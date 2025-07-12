"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._randomFormatUrl = void 0;
const _randomString_1 = require("./_randomString");
const _randomFormatUrl = () => `https://${random(10)}.${random(3)}`;
exports._randomFormatUrl = _randomFormatUrl;
const random = (length) => (0, _randomString_1._randomString)({
    type: "string",
    minLength: length,
    maxLength: length,
});
//# sourceMappingURL=_randomFormatUrl.js.map