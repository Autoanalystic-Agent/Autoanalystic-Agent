"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emend_metadata_atomics = void 0;
const MetadataAtomic_1 = require("../../../schemas/metadata/MetadataAtomic");
const ArrayUtil_1 = require("../../../utils/ArrayUtil");
const emend_metadata_atomics = (meta) => {
    // ATOMICS
    for (const a of meta.atomics) {
        if (is_not_pure(a))
            continue;
        const index = meta.constants.findIndex((c) => c.type === a.type);
        if (index !== -1)
            meta.constants.splice(index, 1);
    }
    // BOOLEAN
    {
        const index = meta.constants.findIndex((c) => c.type === "boolean");
        if (index !== -1 && meta.constants[index].values.length === 2) {
            const temp = meta.constants.splice(index, 1)[0];
            ArrayUtil_1.ArrayUtil.take(meta.atomics, (a) => a.type === "boolean", () => {
                var _a;
                return MetadataAtomic_1.MetadataAtomic.create({
                    type: "boolean",
                    tags: (_a = temp.values[0].tags) !== null && _a !== void 0 ? _a : [],
                });
            });
        }
    }
    // TEMPLATE
    if (meta.templates.length) {
        const atomic = meta.atomics.find((a) => a.type === "string");
        if (atomic !== undefined && false === is_not_pure(atomic))
            meta.templates.splice(0, meta.templates.length);
    }
};
exports.emend_metadata_atomics = emend_metadata_atomics;
const is_not_pure = (atomic) => atomic.tags.length !== 0 &&
    atomic.tags.every((row) => row.length !== 0 && row.every((c) => { var _a; return !!((_a = c.validate) === null || _a === void 0 ? void 0 : _a.length); }));
//# sourceMappingURL=emend_metadata_atomics.js.map