"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._httpQueryParseURLSearchParams = void 0;
const _httpQueryParseURLSearchParams = (input) => {
    if (typeof input === "string") {
        const index = input.indexOf("?");
        input = index === -1 ? "" : input.substring(index + 1);
        return new URLSearchParams(input);
    }
    return input;
};
exports._httpQueryParseURLSearchParams = _httpQueryParseURLSearchParams;
//# sourceMappingURL=_httpQueryParseURLSearchParams.js.map