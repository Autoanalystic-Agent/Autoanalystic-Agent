"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._isFormatRelativeJsonPointer = void 0;
const _isFormatRelativeJsonPointer = (str) => PATTERN.test(str);
exports._isFormatRelativeJsonPointer = _isFormatRelativeJsonPointer;
const PATTERN = /^(?:0|[1-9][0-9]*)(?:#|(?:\/(?:[^~/]|~0|~1)*)*)$/;
//# sourceMappingURL=_isFormatRelativeJsonPointer.js.map