const _httpFormDataReadFile = (input) => input instanceof File
    ? input
    : input === null
        ? undefined
        : input === "null"
            ? null
            : input;

export { _httpFormDataReadFile };
//# sourceMappingURL=_httpFormDataReadFile.mjs.map
