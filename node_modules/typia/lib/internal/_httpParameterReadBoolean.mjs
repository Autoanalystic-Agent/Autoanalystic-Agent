const _httpParameterReadBoolean = (value) => value !== "null"
    ? value === "true" || value === "1"
        ? true
        : value === "false" || value === "0"
            ? false
            : value
    : null;

export { _httpParameterReadBoolean };
//# sourceMappingURL=_httpParameterReadBoolean.mjs.map
