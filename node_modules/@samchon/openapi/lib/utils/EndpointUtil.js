"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EndpointUtil = void 0;
const NamingConvention_1 = require("./NamingConvention");
var EndpointUtil;
(function (EndpointUtil) {
    EndpointUtil.capitalize = (str) => str.length !== 0 ? str[0].toUpperCase() + str.slice(1).toLowerCase() : str;
    EndpointUtil.pascal = (path) => EndpointUtil.splitWithNormalization(path)
        .filter((str) => str[0] !== "{")
        .map(NamingConvention_1.NamingConvention.pascal)
        .join("");
    EndpointUtil.splitWithNormalization = (path) => path
        .split("/")
        .map((str) => EndpointUtil.normalize(str.trim()))
        .filter((str) => !!str.length);
    EndpointUtil.reJoinWithDecimalParameters = (path) => {
        path = path
            .split("/")
            .map((str) => str[0] === "{" && str[str.length - 1] === "}"
            ? `:${str.substring(1, str.length - 1)}`
            : str)
            .join("/");
        return `${path.startsWith("/") ? "" : "/"}${path}`;
    };
    EndpointUtil.normalize = (str) => {
        str = str.split(".").join("_").split("-").join("_").trim();
        if (RESERVED.has(str))
            return `_${str}`;
        else if (str.length !== 0 && "0" <= str[0] && str[0] <= "9")
            str = `_${str}`;
        return str;
    };
    EndpointUtil.escapeDuplicate = (keep) => (change) => keep.includes(change) ? EndpointUtil.escapeDuplicate(keep)(`_${change}`) : change;
})(EndpointUtil || (exports.EndpointUtil = EndpointUtil = {}));
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
