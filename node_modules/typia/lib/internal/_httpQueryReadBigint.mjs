const _httpQueryReadBigint = (str) => !!str?.length ? (str === "null" ? null : toBigint(str)) : undefined;
const toBigint = (str) => {
    try {
        return BigInt(str);
    }
    catch {
        return str;
    }
};

export { _httpQueryReadBigint };
//# sourceMappingURL=_httpQueryReadBigint.mjs.map
