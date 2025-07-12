"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._isFormatIri = void 0;
const _isFormatIri = (str) => PATTERN.test(str);
exports._isFormatIri = _isFormatIri;
const PATTERN = /^[A-Za-z][\d+-.A-Za-z]*:[^\u0000-\u0020"<>\\^`{|}]*$/u;
//# sourceMappingURL=_isFormatIri.js.map