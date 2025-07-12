"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetadataMap = void 0;
class MetadataMap {
    constructor(props) {
        this.key = props.key;
        this.value = props.value;
        this.tags = props.tags;
    }
    static create(props) {
        return new MetadataMap(props);
    }
    getName() {
        var _a;
        return ((_a = this.name_) !== null && _a !== void 0 ? _a : (this.name_ = (() => {
            const symbol = `Map<${this.key.getName()}, ${this.value.getName()}>`;
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
            key: this.key.toJSON(),
            value: this.value.toJSON(),
            tags: this.tags,
        };
    }
}
exports.MetadataMap = MetadataMap;
//# sourceMappingURL=MetadataMap.js.map