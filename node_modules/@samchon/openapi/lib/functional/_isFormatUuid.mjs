const _isFormatUuid = str => PATTERN.test(str);

const PATTERN = /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i;

export { _isFormatUuid };
//# sourceMappingURL=_isFormatUuid.mjs.map
