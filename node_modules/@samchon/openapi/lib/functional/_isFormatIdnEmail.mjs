const _isFormatIdnEmail = str => PATTERN.test(str);

const PATTERN = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

export { _isFormatIdnEmail };
//# sourceMappingURL=_isFormatIdnEmail.mjs.map
