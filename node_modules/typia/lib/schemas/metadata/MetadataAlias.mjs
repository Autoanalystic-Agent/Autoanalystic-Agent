class MetadataAlias {
    type;
    tags;
    name_;
    constructor(props) {
        this.type = props.type;
        this.tags = props.tags;
        this.type = props.type;
    }
    static create(props) {
        return new MetadataAlias(props);
    }
    getName() {
        return (this.name_ ??= (() => {
            if (this.tags.length === 0)
                return this.type.name;
            else if (this.tags.length === 1) {
                const str = [
                    this.type.name,
                    ...this.tags[0].map((t) => t.name),
                ].join(" & ");
                return `(${str})`;
            }
            const rows = this.tags.map((row) => {
                const str = row.map((t) => t.name).join(" & ");
                return row.length === 1 ? str : `(${str})`;
            });
            return `(${this.type.name} & (${rows.join(" | ")}))`;
        })());
    }
    toJSON() {
        return {
            name: this.type.name,
            tags: this.tags,
        };
    }
}

export { MetadataAlias };
//# sourceMappingURL=MetadataAlias.mjs.map
