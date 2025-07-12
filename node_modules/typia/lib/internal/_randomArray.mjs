import { _randomInteger } from './_randomInteger.mjs';

const _randomArray = (props) => {
    const count = _randomInteger({
        minimum: props.minItems ?? 0,
        maximum: props.maxItems ?? (props.minItems ?? 0) + 5,
    });
    if (props.uniqueItems !== true)
        return new Array(count).fill(null).map((_, i) => props.element(i, count));
    const elements = new Set();
    while (elements.size !== count)
        elements.add(props.element(elements.size, count));
    return Array.from(elements);
};

export { _randomArray };
//# sourceMappingURL=_randomArray.mjs.map
