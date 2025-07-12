import { json_schema_plugin } from './json_schema_plugin.mjs';

const json_schema_string = (atomic) => json_schema_plugin({
    schema: {
        type: "string",
    },
    tags: atomic.tags,
});

export { json_schema_string };
//# sourceMappingURL=json_schema_string.mjs.map
