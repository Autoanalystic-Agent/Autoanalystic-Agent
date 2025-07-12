const _httpHeaderReadNumber = (value) => value !== undefined ? toNumber(value) : undefined;
const toNumber = (str) => {
    const value = Number(str);
    return isNaN(value) ? str : value;
};

export { _httpHeaderReadNumber };
//# sourceMappingURL=_httpHeaderReadNumber.mjs.map
