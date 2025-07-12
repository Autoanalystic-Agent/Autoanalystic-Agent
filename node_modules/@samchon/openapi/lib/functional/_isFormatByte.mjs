const _isFormatByte = str => {
    PATTERN.lastIndex = 0;
    return PATTERN.test(str);
};

const PATTERN = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/gm;

export { _isFormatByte };
//# sourceMappingURL=_isFormatByte.mjs.map
