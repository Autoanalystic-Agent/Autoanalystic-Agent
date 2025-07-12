"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetadataSet = void 0;
class MetadataSet {
    constructor(props) {
        this.value = props.value;
        this.tags = props.tags;
    }
    static create(props) {
        return new MetadataSet(props);
    }
    getName() {
        var _a;
        return ((_a = this.name_) !== null && _a !== void 0 ? _a : (this.name_ = (() => {
            const symbol = `Set<${this.value.getName()}>`;
            if (this.tags.length === 0)
                return symbol;
            else if (this.tags.length === 1) {
                const str = [symbol, ...this.tags[0].map((t) => t.name)].join(" & ");
                return `(${str})`;
            }
            const rows = this.tags.map((row) => {
                const str = row.map((t) => t.name).join(" & ");
                return row.length === 1 ? str : `(${str})`;
            });
            return `(${symbol} & (${rows.join(" | ")}))`;
        })()));
    }
    toJSON() {
        return {
            value: this.value.toJSON(),
            tags: this.tags,
        };
    }
}
exports.MetadataSet = MetadataSet;
//# sourceMappingURL=MetadataSet.js.map