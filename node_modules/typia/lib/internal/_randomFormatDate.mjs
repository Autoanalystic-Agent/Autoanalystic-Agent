import { _randomInteger } from './_randomInteger.mjs';

const _randomFormatDate = (props) => new Date(_randomInteger({
    minimum: props?.minimum ?? 0,
    maximum: (props?.maximum ?? props?.minimum === undefined)
        ? Date.now()
        : props.minimum + 365 * 24 * 60 * 60 * 1_000,
}))
    .toISOString()
    .substring(0, 10);

export { _randomFormatDate };
//# sourceMappingURL=_randomFormatDate.mjs.map
