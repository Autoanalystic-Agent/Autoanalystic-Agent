const _isTypeInt32 = (value) => Math.floor(value) === value && MINIMUM <= value && value <= MAXIMUM;
const MINIMUM = -2147483648;
const MAXIMUM = 2 ** 31 - 1;

export { _isTypeInt32 };
//# sourceMappingURL=_isTypeInt32.mjs.map
