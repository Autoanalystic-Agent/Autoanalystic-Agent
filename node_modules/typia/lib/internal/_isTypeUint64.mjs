const _isTypeUint64 = (value) => Math.floor(value) === value && MINIMUM <= value && value <= MAXIMUM;
const MINIMUM = 0;
const MAXIMUM = 2 ** 64 - 1;

export { _isTypeUint64 };
//# sourceMappingURL=_isTypeUint64.mjs.map
