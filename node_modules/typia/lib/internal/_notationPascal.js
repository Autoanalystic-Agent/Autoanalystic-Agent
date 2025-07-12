"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._notationPascal = void 0;
const __notationCapitalize_1 = require("./private/__notationCapitalize");
const __notationUnsnake_1 = require("./private/__notationUnsnake");
exports._notationPascal = (0, __notationUnsnake_1.__notationUnsnake)({
    plain: (str) => str.length ? `${str[0].toUpperCase()}${str.substring(1)}` : str,
    snake: __notationCapitalize_1.__notationCapitalize,
});
//# sourceMappingURL=_notationPascal.js.map