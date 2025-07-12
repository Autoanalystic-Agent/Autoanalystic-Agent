"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._isFormatUriTemplate = void 0;
const _isFormatUriTemplate = (str) => PATTERN.test(str);
exports._isFormatUriTemplate = _isFormatUriTemplate;
const PATTERN = /^(?:(?:[^\x00-\x20"'<>%\\^`{|}]|%[0-9a-f]{2})|\{[+#./;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?)*\})*$/i;
//# sourceMappingURL=_isFormatUriTemplate.js.map