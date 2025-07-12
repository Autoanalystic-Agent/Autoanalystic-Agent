const _httpParameterReadBigint = (value) => value !== "null" ? toBigint(value) : null;
const toBigint = (str) => {
    try {
        return BigInt(str);
    }
    catch {
        return str;
    }
};

export { _httpParameterReadBigint };
//# sourceMappingURL=_httpParameterReadBigint.mjs.map
