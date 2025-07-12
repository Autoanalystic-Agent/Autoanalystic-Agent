"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._isFormatTime = void 0;
const _isFormatTime = (str) => PATTERN.test(str);
exports._isFormatTime = _isFormatTime;
const PATTERN = /^([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](?:\.[0-9]{1,9})?(Z|[+-]([01][0-9]|2[0-3]):[0-5][0-9])$/i;
