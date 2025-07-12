class MetadataSet {
    value;
    tags;
    name_;
    constructor(props) {
        this.value = props.value;
        this.tags = props.tags;
    }
    static create(props) {
        return new MetadataSet(props);
    }
    getName() {
        return (this.name_ ??= (() => {
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
        })());
    }
    toJSON() {
        return {
            value: this.value.toJSON(),
            tags: this.tags,
        };
    }
}

export { MetadataSet };
//# sourceMappingURL=MetadataSet.mjs.map
