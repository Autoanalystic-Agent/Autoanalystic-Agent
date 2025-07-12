const _httpFormDataReadBlob = (input) => input instanceof Blob
    ? input
    : input === null
        ? undefined
        : input === "null"
            ? null
            : input;

export { _httpFormDataReadBlob };
//# sourceMappingURL=_httpFormDataReadBlob.mjs.map
