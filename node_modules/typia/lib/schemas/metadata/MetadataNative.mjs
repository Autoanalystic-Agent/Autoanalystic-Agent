class MetadataNative {
    name;
    tags;
    typeName_;
    constructor(props) {
        this.name = props.name;
        this.tags = props.tags;
    }
    static create(props) {
        return new MetadataNative(props);
    }
    getName() {
        return (this.typeName_ ??= (() => {
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
        })());
    }
    toJSON() {
        return {
            name: this.name,
            tags: this.tags,
        };
    }
}

export { MetadataNative };
//# sourceMappingURL=MetadataNative.mjs.map
