const _accessExpressionAsString = (str) => variable(str) ? `.${str}` : `[${JSON.stringify(str)}]`;
const variable = (str) => reserved(str) === false && /^[a-zA-Z_$][a-zA-Z_$0-9]*$/g.test(str);
const reserved = (str) => RESERVED.has(str);
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
    "new",
    "null",
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

export { _accessExpressionAsString };
//# sourceMappingURL=_accessExpressionAsString.mjs.map
