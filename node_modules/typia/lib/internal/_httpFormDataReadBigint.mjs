const _httpFormDataReadBigint = (input) => input instanceof File
    ? input
    : !!input?.length
        ? input === "null"
            ? null
            : toBigint(input)
        : undefined;
const toBigint = (str) => {
    try {
        return BigInt(str);
    }
    catch {
        return str;
    }
};

export { _httpFormDataReadBigint };
//# sourceMappingURL=_httpFormDataReadBigint.mjs.map
