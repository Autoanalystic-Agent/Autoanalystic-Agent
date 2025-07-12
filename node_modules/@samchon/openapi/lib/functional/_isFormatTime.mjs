const _isFormatTime = str => PATTERN.test(str);

const PATTERN = /^([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](?:\.[0-9]{1,9})?(Z|[+-]([01][0-9]|2[0-3]):[0-5][0-9])$/i;

export { _isFormatTime };
//# sourceMappingURL=_isFormatTime.mjs.map
