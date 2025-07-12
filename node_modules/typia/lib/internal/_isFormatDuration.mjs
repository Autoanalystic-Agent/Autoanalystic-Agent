const _isFormatDuration = (str) => PATTERN.test(str);
const PATTERN = /^P(?!$)((\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?|(\d+W)?)$/;

export { _isFormatDuration };
//# sourceMappingURL=_isFormatDuration.mjs.map
