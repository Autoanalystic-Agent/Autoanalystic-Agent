import { _randomInteger } from './_randomInteger.mjs';

const _randomFormatTime = () => new Date(_randomInteger({
    minimum: 0,
    maximum: DAY,
}))
    .toISOString()
    .substring(11);
const DAY = 86_400_000;

export { _randomFormatTime };
//# sourceMappingURL=_randomFormatTime.mjs.map
