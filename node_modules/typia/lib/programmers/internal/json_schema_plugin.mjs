const json_schema_plugin = (props) => {
    const plugins = props.tags
        .map((row) => row.filter((t) => t.schema !== undefined))
        .filter((row) => row.length !== 0);
    if (plugins.length === 0)
        return [props.schema];
    return plugins.map((row) => {
        const base = { ...props.schema };
        for (const tag of row)
            Object.assign(base, tag.schema);
        return base;
    });
};

export { json_schema_plugin };
//# sourceMappingURL=json_schema_plugin.mjs.map
