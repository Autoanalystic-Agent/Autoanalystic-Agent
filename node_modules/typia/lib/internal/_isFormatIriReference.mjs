const _isFormatIriReference = (str) => PATTERN.test(str);
const PATTERN = /^[A-Za-z][\d+-.A-Za-z]*:[^\u0000-\u0020"<>\\^`{|}]*$/u;

export { _isFormatIriReference };
//# sourceMappingURL=_isFormatIriReference.mjs.map
