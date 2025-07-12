"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._randomFormatUuid = void 0;
const _randomFormatUuid = () => "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
});
exports._randomFormatUuid = _randomFormatUuid;
//# sourceMappingURL=_randomFormatUuid.js.map