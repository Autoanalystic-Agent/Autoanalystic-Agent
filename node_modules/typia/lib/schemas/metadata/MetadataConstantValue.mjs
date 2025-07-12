class MetadataConstantValue {
    value;
    tags;
    description;
    jsDocTags;
    name_;
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
        return (this.name_ ??= getName(this));
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
const getName = (obj) => {
    const base = typeof obj.value === "string"
        ? JSON.stringify(obj.value)
        : obj.value.toString();
    if (!obj.tags?.length)
        return base;
    const rows = obj.tags.map((row) => {
        const str = row.map((t) => t.name).join(" & ");
        return row.length === 1 ? str : `(${str})`;
    });
    return `(${base} & (${rows.join(" | ")}))`;
};

export { MetadataConstantValue };
//# sourceMappingURL=MetadataConstantValue.mjs.map
