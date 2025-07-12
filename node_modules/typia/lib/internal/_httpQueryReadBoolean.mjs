const _httpQueryReadBoolean = (str) => str === null
    ? undefined
    : str === "null"
        ? null
        : str.length === 0
            ? true
            : str === "true" || str === "1"
                ? true
                : str === "false" || str === "0"
                    ? false
                    : str; // wrong type

export { _httpQueryReadBoolean };
//# sourceMappingURL=_httpQueryReadBoolean.mjs.map
