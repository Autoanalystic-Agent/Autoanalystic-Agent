const _httpQueryParseURLSearchParams = (input) => {
    if (typeof input === "string") {
        const index = input.indexOf("?");
        input = index === -1 ? "" : input.substring(index + 1);
        return new URLSearchParams(input);
    }
    return input;
};

export { _httpQueryParseURLSearchParams };
//# sourceMappingURL=_httpQueryParseURLSearchParams.mjs.map
