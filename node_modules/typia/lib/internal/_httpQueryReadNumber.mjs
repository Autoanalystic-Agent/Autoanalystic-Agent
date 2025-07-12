const _httpQueryReadNumber = (str) => !!str?.length ? (str === "null" ? null : toNumber(str)) : undefined;
const toNumber = (str) => {
    const value = Number(str);
    return isNaN(value) ? str : value;
};

export { _httpQueryReadNumber };
//# sourceMappingURL=_httpQueryReadNumber.mjs.map
