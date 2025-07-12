import { json_schema_plugin } from './json_schema_plugin.mjs';

const json_schema_bigint = (atomic) => json_schema_plugin({
    schema: {
        type: "integer",
    },
    tags: atomic.tags,
});

export { json_schema_bigint };
//# sourceMappingURL=json_schema_bigint.mjs.map
