"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._notationCamel = void 0;
const __notationCapitalize_1 = require("./private/__notationCapitalize");
const __notationUnsnake_1 = require("./private/__notationUnsnake");
exports._notationCamel = (0, __notationUnsnake_1.__notationUnsnake)({
    plain: (str) => str.length
        ? str === str.toUpperCase()
            ? str.toLocaleLowerCase()
            : `${str[0].toLowerCase()}${str.substring(1)}`
        : str,
    snake: (str, i) => i === 0 ? str.toLowerCase() : (0, __notationCapitalize_1.__notationCapitalize)(str.toLowerCase()),
});
//# sourceMappingURL=_notationCamel.js.map