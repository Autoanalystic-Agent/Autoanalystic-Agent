const json_schema_description = (props) => props.jsDocTags
    ?.find((tag) => tag.name === "description")
    ?.text?.[0]?.text?.split("\r\n")
    .join("\n") ??
    props.description ??
    undefined;

export { json_schema_description };
//# sourceMappingURL=json_schema_description.mjs.map
