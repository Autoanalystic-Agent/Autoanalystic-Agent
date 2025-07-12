"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NamingConvention = void 0;
var NamingConvention;
(function (NamingConvention) {
    function snake(str) {
        const indexes = [];
        for (let i = 0; i < str.length; i++) {
            const code = str.charCodeAt(i);
            if (65 <= code && code <= 90)
                indexes.push(i);
        }
        for (let i = indexes.length - 1; i > 0; --i) {
            const now = indexes[i];
            const prev = indexes[i - 1];
            if (now - prev === 1)
                indexes.splice(i, 1);
        }
        if (indexes.length !== 0 && indexes[0] === 0)
            indexes.splice(0, 1);
        if (indexes.length === 0)
            return str.toLowerCase();
        let ret = "";
        for (let i = 0; i < indexes.length; i++) {
            const first = i === 0 ? 0 : indexes[i - 1];
            const last = indexes[i];
            ret += str.substring(first, last).toLowerCase();
            ret += "_";
        }
        ret += str.substring(indexes[indexes.length - 1]).toLowerCase();
        return ret;
    }
    NamingConvention.snake = snake;
    function camel(str) {
        return unsnake((str) => {
            if (str.length === 0)
                return str;
            else if (str[0] === str[0].toUpperCase())
                return str[0].toLowerCase() + str.substring(1);
            else
                return str;
        })(str);
    }
    NamingConvention.camel = camel;
    function pascal(str) {
        return unsnake((str) => {
            if (str.length === 0)
                return str;
            else if (str[0] === str[0].toLowerCase())
                return str[0].toUpperCase() + str.substring(1);
            else
                return str;
        })(str);
    }
    NamingConvention.pascal = pascal;
    const unsnake = (escaper) => (str) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        let prefix = "";
        for (let i = 0; i < str.length; i++) {
            if (str[i] === "_")
                prefix += "_";
            else
                break;
        }
        if (prefix.length !== 0)
            str = str.substring(prefix.length);
        const indexes = [];
        for (let i = 0; i < str.length; i++) {
            const ch = str[i];
            if (ch !== "_")
                continue;
            const last = indexes[indexes.length - 1];
            if (last === undefined || last[0] + last[1] !== i)
                indexes.push([i, 1]);
            else
                ++last[1];
        }
        if (indexes.length === 0)
            return prefix + escaper(str);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        let ret = "";
        for (let i = 0; i < indexes.length; i++) {
            const [first] = indexes[i];
            if (i === 0)
                if (first === 0)
                    ret += "_";
                else
                    ret += str.substring(0, first);
            else {
                const [prevFirst, prevLength] = indexes[i - 1];
                const piece = str.substring(prevFirst + prevLength, first);
                if (piece.length)
                    ret += NamingConvention.capitalize(piece);
            }
        }
        const last = indexes[indexes.length - 1];
        const piece = str.substring(last[0] + last[1]);
        if (last.length)
            ret += NamingConvention.capitalize(piece);
        return prefix + escaper(ret);
    };
    NamingConvention.capitalize = (str) => str.length !== 0 ? str[0].toUpperCase() + str.slice(1).toLowerCase() : str;
    NamingConvention.variable = (str) => NamingConvention.reserved(str) === false && /^[a-zA-Z_$][a-zA-Z_$0-9]*$/g.test(str);
    NamingConvention.reserved = (str) => RESERVED.has(str);
})(NamingConvention || (exports.NamingConvention = NamingConvention = {}));
const RESERVED = new Set([
    "break",
    "case",
    "catch",
    "class",
    "const",
    "continue",
    "debugger",
    "default",
    "delete",
    "do",
    "else",
    "enum",
    "export",
    "extends",
    "false",
    "finally",
    "for",
    "function",
    "if",
    "import",
    "in",
    "instanceof",
    "module",
    "new",
    "null",
    "package",
    "public",
    "private",
    "protected",
    "return",
    "super",
    "switch",
    "this",
    "throw",
    "true",
    "try",
    "typeof",
    "var",
    "void",
    "while",
    "with",
]);
