import { _randomString } from './_randomString.mjs';

const _randomFormatJsonPointer = () => `/components/schemas/${random()}`;
const random = () => _randomString({ minLength: 10, maxLength: 10 });

export { _randomFormatJsonPointer };
//# sourceMappingURL=_randomFormatJsonPointer.mjs.map
