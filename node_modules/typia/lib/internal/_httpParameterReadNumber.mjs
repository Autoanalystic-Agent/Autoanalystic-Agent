const _httpParameterReadNumber = (value) => value !== "null" ? toNumber(value) : null;
const toNumber = (str) => {
    const value = Number(str);
    return isNaN(value) ? str : value;
};

export { _httpParameterReadNumber };
//# sourceMappingURL=_httpParameterReadNumber.mjs.map
