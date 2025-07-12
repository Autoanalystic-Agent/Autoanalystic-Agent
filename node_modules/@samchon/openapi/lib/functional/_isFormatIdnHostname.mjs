const _isFormatIdnHostname = str => PATTERN.test(str);

const PATTERN = /^([a-z0-9\u00a1-\uffff0-9]+(-[a-z0-9\u00a1-\uffff0-9]+)*\.)+[a-z\u00a1-\uffff]{2,}$/i;

export { _isFormatIdnHostname };
//# sourceMappingURL=_isFormatIdnHostname.mjs.map
