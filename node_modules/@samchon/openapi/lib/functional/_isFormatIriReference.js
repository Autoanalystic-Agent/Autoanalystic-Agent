"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._isFormatIriReference = void 0;
const _isFormatIriReference = (str) => PATTERN.test(str);
exports._isFormatIriReference = _isFormatIriReference;
const PATTERN = /^[A-Za-z][\d+-.A-Za-z]*:[^\u0000-\u0020"<>\\^`{|}]*$/u;
