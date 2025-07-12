import { json_schema_plugin } from './json_schema_plugin.mjs';

const json_schema_boolean = (atomic) => json_schema_plugin({
    schema: {
        type: "boolean",
    },
    tags: atomic.tags,
});

export { json_schema_boolean };
//# sourceMappingURL=json_schema_boolean.mjs.map
