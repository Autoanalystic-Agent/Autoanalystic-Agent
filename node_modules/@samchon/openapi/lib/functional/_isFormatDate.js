"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._isFormatDate = void 0;
const _isFormatDate = (str) => FORMAT.test(str);
exports._isFormatDate = _isFormatDate;
const FORMAT = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
