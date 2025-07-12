import { json_schema_plugin } from './json_schema_plugin.mjs';

const json_schema_number = (atomic) => json_schema_plugin({
    schema: {
        type: "number",
    },
    tags: atomic.tags,
});

export { json_schema_number };
//# sourceMappingURL=json_schema_number.mjs.map
