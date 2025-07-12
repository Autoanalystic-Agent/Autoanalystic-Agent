"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._randomPattern = void 0;
const randexp_1 = __importDefault(require("randexp"));
const _randomPattern = (regex) => {
    const r = new randexp_1.default(regex);
    for (let i = 0; i < 10; ++i) {
        const str = r.gen();
        if (regex.test(str))
            return str;
    }
    return r.gen();
};
exports._randomPattern = _randomPattern;
//# sourceMappingURL=_randomPattern.js.map