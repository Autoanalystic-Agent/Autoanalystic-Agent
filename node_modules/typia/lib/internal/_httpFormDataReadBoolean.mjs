const _httpFormDataReadBoolean = (input) => input instanceof File
    ? input
    : input === null
        ? undefined
        : input === "null"
            ? null
            : input.length === 0
                ? true
                : input === "true" || input === "1"
                    ? true
                    : input === "false" || input === "0"
                        ? false
                        : input; // wrong type

export { _httpFormDataReadBoolean };
//# sourceMappingURL=_httpFormDataReadBoolean.mjs.map
