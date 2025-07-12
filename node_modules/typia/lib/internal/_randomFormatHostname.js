"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._randomFormatHostname = void 0;
const _randomString_1 = require("./_randomString");
const _randomFormatHostname = () => `${random(10)}.${random(3)}`;
exports._randomFormatHostname = _randomFormatHostname;
const random = (length) => (0, _randomString_1._randomString)({ type: "string", minLength: length, maxLength: length });
//# sourceMappingURL=_randomFormatHostname.js.map