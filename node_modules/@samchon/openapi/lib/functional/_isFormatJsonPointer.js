"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._isFormatJsonPointer = void 0;
const _isFormatJsonPointer = (str) => PATTERN.test(str);
exports._isFormatJsonPointer = _isFormatJsonPointer;
const PATTERN = /^(?:\/(?:[^~/]|~0|~1)*)*$/;
