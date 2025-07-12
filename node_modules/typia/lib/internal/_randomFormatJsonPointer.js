"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._randomFormatJsonPointer = void 0;
const _randomString_1 = require("./_randomString");
const _randomFormatJsonPointer = () => `/components/schemas/${random()}`;
exports._randomFormatJsonPointer = _randomFormatJsonPointer;
const random = () => (0, _randomString_1._randomString)({ type: "string", minLength: 10, maxLength: 10 });
//# sourceMappingURL=_randomFormatJsonPointer.js.map