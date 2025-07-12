"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetadataConstantValue = void 0;
class MetadataConstantValue {
    constructor(props) {
        this.value = props.value;
        this.tags = props.tags;
        this.description = props.description;
        this.jsDocTags = props.jsDocTags;
    }
    static create(props) {
        return new MetadataConstantValue(props);
    }
    static from(json) {
        return MetadataConstantValue.create({
            value: typeof json.value === "bigint" ? BigInt(json.value) : json.value,
            tags: json.tags,
            description: json.description,
            jsDocTags: json.jsDocTags,
        });
    }
    getName() {
        var _a;
        return ((_a = this.name_) !== null && _a !== void 0 ? _a : (this.name_ = getName(this)));
    }
    toJSON() {
        return {
            value: typeof this.value === "bigint" ? this.value.toString() : this.value,
            tags: this.tags,
            description: this.description,
            jsDocTags: this.jsDocTags,
        };
    }
}
exports.MetadataConstantValue = MetadataConstantValue;
const getName = (obj) => {
    var _a;
    const base = typeof obj.value === "string"
        ? JSON.stringify(obj.value)
        : obj.value.toString();
    if (!((_a = obj.tags) === null || _a === void 0 ? void 0 : _a.length))
        return base;
    const rows = obj.tags.map((row) => {
        const str = row.map((t) => t.name).join(" & ");
        return row.length === 1 ? str : `(${str})`;
    });
    return `(${base} & (${rows.join(" | ")}))`;
};
//# sourceMappingURL=MetadataConstantValue.js.map