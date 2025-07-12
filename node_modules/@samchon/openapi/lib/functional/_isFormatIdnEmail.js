"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._isFormatIdnEmail = void 0;
const _isFormatIdnEmail = (str) => PATTERN.test(str);
exports._isFormatIdnEmail = _isFormatIdnEmail;
const PATTERN = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
