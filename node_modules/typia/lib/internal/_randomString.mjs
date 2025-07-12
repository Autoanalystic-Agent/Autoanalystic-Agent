import { _randomInteger } from './_randomInteger.mjs';

const _randomString = (props) => {
    const length = _randomInteger({
        minimum: props.minLength ?? 0,
        maximum: props.maxLength,
    });
    return new Array(length)
        .fill(0)
        .map(() => ALPHABETS[random()])
        .join("");
};
const ALPHABETS = "abcdefghijklmnopqrstuvwxyz";
const random = () => _randomInteger({
    minimum: 0,
    maximum: ALPHABETS.length - 1,
});

export { _randomString };
//# sourceMappingURL=_randomString.mjs.map
