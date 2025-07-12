import { _randomInteger } from './_randomInteger.mjs';

const _randomFormatIpv4 = () => new Array(4).fill(0).map(random).join(".");
const random = () => _randomInteger({
    minimum: 0,
    maximum: 255,
});

export { _randomFormatIpv4 };
//# sourceMappingURL=_randomFormatIpv4.mjs.map
