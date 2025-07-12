const _isFormatIri = (str) => PATTERN.test(str);
const PATTERN = /^[A-Za-z][\d+-.A-Za-z]*:[^\u0000-\u0020"<>\\^`{|}]*$/u;

export { _isFormatIri };
//# sourceMappingURL=_isFormatIri.mjs.map
