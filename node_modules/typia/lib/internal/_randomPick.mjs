import { _randomInteger } from './_randomInteger.mjs';

const _randomPick = (array) => array[random(array)];
const random = (array) => _randomInteger({
    minimum: 0,
    maximum: array.length - 1,
});

export { _randomPick };
//# sourceMappingURL=_randomPick.mjs.map
