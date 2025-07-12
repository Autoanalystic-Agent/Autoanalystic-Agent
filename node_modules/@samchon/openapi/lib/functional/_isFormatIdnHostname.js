"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._isFormatIdnHostname = void 0;
const _isFormatIdnHostname = (str) => PATTERN.test(str);
exports._isFormatIdnHostname = _isFormatIdnHostname;
const PATTERN = /^([a-z0-9\u00a1-\uffff0-9]+(-[a-z0-9\u00a1-\uffff0-9]+)*\.)+[a-z\u00a1-\uffff]{2,}$/i;
