const _httpHeaderReadBigint = (value) => value !== undefined ? toBigint(value) : undefined;
const toBigint = (str) => {
    try {
        return BigInt(str);
    }
    catch {
        return str;
    }
};

export { _httpHeaderReadBigint };
//# sourceMappingURL=_httpHeaderReadBigint.mjs.map
