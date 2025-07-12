import { __notationCapitalize } from './private/__notationCapitalize.mjs';
import { __notationUnsnake } from './private/__notationUnsnake.mjs';

const _notationPascal = __notationUnsnake({
    plain: (str) => str.length ? `${str[0].toUpperCase()}${str.substring(1)}` : str,
    snake: __notationCapitalize,
});

export { _notationPascal };
//# sourceMappingURL=_notationPascal.mjs.map
