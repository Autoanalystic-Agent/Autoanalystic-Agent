const _httpFormDataReadString = (input) => input instanceof File
    ? input
    : input === null
        ? undefined
        : input === "null"
            ? null
            : input;

export { _httpFormDataReadString };
//# sourceMappingURL=_httpFormDataReadString.mjs.map
