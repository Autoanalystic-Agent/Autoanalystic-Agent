"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ByteArrayUtil = void 0;
var ByteArrayUtil;
(function (ByteArrayUtil) {
    function toUtf8(byteArray) {
        return new TextDecoder().decode(byteArray);
    }
    ByteArrayUtil.toUtf8 = toUtf8;
})(ByteArrayUtil || (exports.ByteArrayUtil = ByteArrayUtil = {}));
//# sourceMappingURL=ByteArrayUtil.js.map