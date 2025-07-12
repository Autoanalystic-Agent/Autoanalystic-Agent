import { __notationCapitalize } from './private/__notationCapitalize.mjs';
import { __notationUnsnake } from './private/__notationUnsnake.mjs';

const _notationCamel = __notationUnsnake({
    plain: (str) => str.length
        ? str === str.toUpperCase()
            ? str.toLocaleLowerCase()
            : `${str[0].toLowerCase()}${str.substring(1)}`
        : str,
    snake: (str, i) => i === 0 ? str.toLowerCase() : __notationCapitalize(str.toLowerCase()),
});

export { _notationCamel };
//# sourceMappingURL=_notationCamel.mjs.map
