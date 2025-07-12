import { _randomString } from './_randomString.mjs';

const _randomFormatEmail = () => `${random(10)}@${random(10)}.${random(3)}`;
const random = (length) => _randomString({
    minLength: length,
    maxLength: length,
});

export { _randomFormatEmail };
//# sourceMappingURL=_randomFormatEmail.mjs.map
