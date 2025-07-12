import { _randomInteger } from './_randomInteger.mjs';

const _randomFormatDatetime = (props) => new Date(_randomInteger({
    minimum: props?.minimum ?? 0,
    maximum: (props?.maximum ?? props?.minimum === undefined)
        ? Date.now()
        : props.minimum + 365 * 24 * 60 * 60 * 1_000,
})).toISOString();

export { _randomFormatDatetime };
//# sourceMappingURL=_randomFormatDatetime.mjs.map
