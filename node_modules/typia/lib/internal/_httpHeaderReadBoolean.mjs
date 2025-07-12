const _httpHeaderReadBoolean = (value) => value !== undefined
    ? value === "true"
        ? true
        : value === "false"
            ? false
            : value
    : undefined;

export { _httpHeaderReadBoolean };
//# sourceMappingURL=_httpHeaderReadBoolean.mjs.map
