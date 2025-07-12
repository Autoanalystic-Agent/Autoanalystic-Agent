"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.json_schema_title = void 0;
const CommentFactory_1 = require("../../factories/CommentFactory");
const json_schema_title = (schema) => {
    var _a, _b;
    const info = (_a = schema.jsDocTags) === null || _a === void 0 ? void 0 : _a.find((tag) => tag.name === "title");
    return !!((_b = info === null || info === void 0 ? void 0 : info.text) === null || _b === void 0 ? void 0 : _b.length) ? CommentFactory_1.CommentFactory.merge(info.text) : undefined;
};
exports.json_schema_title = json_schema_title;
//# sourceMappingURL=json_schema_title.js.map