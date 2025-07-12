"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._isFormatUuid = void 0;
const _isFormatUuid = (str) => PATTERN.test(str);
exports._isFormatUuid = _isFormatUuid;
const PATTERN = /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i;
