"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentFactory = void 0;
const typescript_1 = __importDefault(require("typescript"));
var CommentFactory;
(function (CommentFactory) {
    CommentFactory.description = (symbol, includeTags = false) => {
        var _a, _b, _c;
        const node = (_a = symbol.declarations) === null || _a === void 0 ? void 0 : _a[0];
        if (!node)
            return undefined;
        // FOR LEGACY TS < 5.2
        const [major, minor] = typescript_1.default.versionMajorMinor.split(".").map(Number);
        if (major < 5 || (major === 5 && minor < 1)) {
            const content = [];
            const main = typescript_1.default.displayPartsToString(symbol.getDocumentationComment(undefined));
            if (main.length) {
                content.push(main);
                if (includeTags && symbol.getJsDocTags().length)
                    content.push("");
            }
            if (includeTags)
                for (const tag of symbol.getJsDocTags()) {
                    content.push(tag.text
                        ? `@${tag.name} ${typescript_1.default.displayPartsToString(tag.text)}`
                        : `@${tag.name}`);
                }
            return content.length
                ? content.map((line) => line.split("\r\n").join("\n")).join("\n")
                : undefined;
        }
        // NEW FEATURE OF TS 5.2
        const elements = typescript_1.default.getJSDocCommentsAndTags(node);
        if (elements.length === 0)
            return undefined;
        const content = [];
        for (const comment of elements) {
            if (typescript_1.default.isJSDoc(comment)) {
                const parsed = typescript_1.default.getTextOfJSDocComment(comment.comment);
                if (parsed === null || parsed === void 0 ? void 0 : parsed.length) {
                    content.push(parsed);
                    if (includeTags && ((_b = comment.tags) === null || _b === void 0 ? void 0 : _b.length))
                        content.push("");
                }
                if (includeTags)
                    for (const tag of (_c = comment.tags) !== null && _c !== void 0 ? _c : [])
                        content.push(parseJSDocTag(tag));
            }
            else if (includeTags)
                content.push(parseJSDocTag(comment));
        }
        const output = content
            .map((line) => line.split("\r\n").join("\n"))
            .join("\n");
        return output.length ? output : undefined;
    };
    CommentFactory.merge = (comments) => comments
        .map((part) => part.text)
        .map((str) => str.split("\r\n").join("\n"))
        .join("");
})(CommentFactory || (exports.CommentFactory = CommentFactory = {}));
const parseJSDocTag = (tag) => {
    var _a;
    const name = (_a = tag.name) === null || _a === void 0 ? void 0 : _a.getText();
    const parsed = typescript_1.default.getTextOfJSDocComment(tag.comment);
    return [`@${tag.tagName.text}`, name, parsed]
        .filter((str) => !!(str === null || str === void 0 ? void 0 : str.length))
        .join(" ");
};
//# sourceMappingURL=CommentFactory.js.map