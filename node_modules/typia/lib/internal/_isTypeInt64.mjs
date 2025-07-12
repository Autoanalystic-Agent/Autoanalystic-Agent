const _isTypeInt64 = (value) => Math.floor(value) === value && MINIMUM <= value && value <= MAXIMUM;
const MINIMUM = -9223372036854776e3;
const MAXIMUM = 2 ** 63 - 1;

export { _isTypeInt64 };
//# sourceMappingURL=_isTypeInt64.mjs.map
