import { _randomString } from './_randomString.mjs';

const _randomFormatHostname = () => `${random(10)}.${random(3)}`;
const random = (length) => _randomString({ minLength: length, maxLength: length });

export { _randomFormatHostname };
//# sourceMappingURL=_randomFormatHostname.mjs.map
