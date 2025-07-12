import { _randomString } from './_randomString.mjs';

const _randomFormatUrl = () => `https://${random(10)}.${random(3)}`;
const random = (length) => _randomString({
    minLength: length,
    maxLength: length,
});

export { _randomFormatUrl };
//# sourceMappingURL=_randomFormatUrl.mjs.map
