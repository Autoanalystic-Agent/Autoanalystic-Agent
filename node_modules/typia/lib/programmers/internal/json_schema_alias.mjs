import { json_schema_description } from './json_schema_description.mjs';
import { json_schema_object } from './json_schema_object.mjs';
import { json_schema_station } from './json_schema_station.mjs';
import { json_schema_title } from './json_schema_title.mjs';

const json_schema_alias = (props) => {
    if (props.alias.type.value.size() === 1 &&
        props.alias.type.value.objects.length === 1)
        return json_schema_object({
            components: props.components,
            object: props.alias.type.value.objects[0],
        });
    const $ref = `#/components/schemas/${props.alias.type.name}`;
    if (props.components.schemas?.[props.alias.type.name] === undefined) {
        // TEMPORARY ASSIGNMENT
        props.components.schemas ??= {};
        props.components.schemas[props.alias.type.name] = {};
        // GENERATE SCHEMA
        const schema = json_schema_station({
            blockNever: props.blockNever,
            components: props.components,
            attribute: {
                deprecated: props.alias.type.jsDocTags.some((tag) => tag.name === "deprecated") ||
                    undefined,
                title: json_schema_title(props.alias.type),
                description: json_schema_description(props.alias.type),
            },
            metadata: props.alias.type.value,
        });
        if (schema !== null)
            Object.assign(props.components.schemas[props.alias.type.name], schema);
    }
    return [{ $ref }];
};

export { json_schema_alias };
//# sourceMappingURL=json_schema_alias.mjs.map
