const _httpFormDataReadNumber = (input) => input instanceof File
    ? input
    : !!input?.length
        ? input === "null"
            ? null
            : toNumber(input)
        : undefined;
const toNumber = (str) => {
    const value = Number(str);
    return isNaN(value) ? str : value;
};

export { _httpFormDataReadNumber };
//# sourceMappingURL=_httpFormDataReadNumber.mjs.map
