"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._isFormatHostname = void 0;
const _isFormatHostname = (str) => PATTERN.test(str);
exports._isFormatHostname = _isFormatHostname;
const PATTERN = /^(?=.{1,253}\.?$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*\.?$/i;
