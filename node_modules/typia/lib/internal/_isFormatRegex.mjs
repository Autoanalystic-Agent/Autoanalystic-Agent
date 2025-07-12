const _isFormatRegex = (str) => {
    try {
        new RegExp(str);
        return true;
    }
    catch {
        return false;
    }
};

export { _isFormatRegex };
//# sourceMappingURL=_isFormatRegex.mjs.map
