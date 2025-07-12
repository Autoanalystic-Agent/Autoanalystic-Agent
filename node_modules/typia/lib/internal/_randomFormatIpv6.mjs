import { _randomInteger } from './_randomInteger.mjs';

const _randomFormatIpv6 = () => new Array(8).fill(0).map(random).join(":");
const random = () => _randomInteger({
    minimum: 0,
    maximum: 65_535,
}).toString(16);

export { _randomFormatIpv6 };
//# sourceMappingURL=_randomFormatIpv6.mjs.map
