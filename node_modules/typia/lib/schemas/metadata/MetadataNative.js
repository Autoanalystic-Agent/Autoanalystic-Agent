"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetadataNative = void 0;
class MetadataNative {
    constructor(props) {
        this.name = props.name;
        this.tags = props.tags;
    }
    static create(props) {
        return new MetadataNative(props);
    }
    getName() {
        var _a;
        return ((_a = this.typeName_) !== null && _a !== void 0 ? _a : (this.typeName_ = (() => {
            if (this.tags.length === 0)
                return this.name;
            else if (this.tags.length === 1) {
                const str = [
                    this.name,
                    ...this.tags[0].map((t) => t.name),
                ].join(" & ");
                return `(${str})`;
            }
            const rows = this.tags.map((row) => {
                const str = row.map((t) => t.name).join(" & ");
                return row.length === 1 ? str : `(${str})`;
            });
            return `(${this.name} & (${rows.join(" | ")}))`;
        })()));
    }
    toJSON() {
        return {
            name: this.name,
            tags: this.tags,
        };
    }
}
exports.MetadataNative = MetadataNative;
//# sourceMappingURL=MetadataNative.js.map