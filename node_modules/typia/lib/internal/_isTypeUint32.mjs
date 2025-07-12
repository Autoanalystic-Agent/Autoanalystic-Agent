const _isTypeUint32 = (value) => Math.floor(value) === value && MINIMUM <= value && value <= MAXIMUM;
const MINIMUM = 0;
const MAXIMUM = 2 ** 32 - 1;

export { _isTypeUint32 };
//# sourceMappingURL=_isTypeUint32.mjs.map
