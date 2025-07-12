import { json_schema_description } from './json_schema_description.mjs';
import { json_schema_plugin } from './json_schema_plugin.mjs';
import { json_schema_title } from './json_schema_title.mjs';

const json_schema_constant = (constant) => constant.values
    .map((value) => json_schema_plugin({
    schema: {
        const: typeof value.value === "bigint"
            ? Number(value.value)
            : value.value,
        title: json_schema_title(value),
        description: json_schema_description(value),
    },
    tags: value.tags ?? [],
}))
    .flat();

export { json_schema_constant };
//# sourceMappingURL=json_schema_constant.mjs.map
