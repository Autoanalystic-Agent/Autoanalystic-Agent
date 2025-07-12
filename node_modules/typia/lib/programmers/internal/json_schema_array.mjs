import { json_schema_plugin } from './json_schema_plugin.mjs';
import { json_schema_station } from './json_schema_station.mjs';

const json_schema_array = (props) => {
    const factory = () => json_schema_plugin({
        schema: {
            type: "array",
            items: json_schema_station({
                blockNever: false,
                components: props.components,
                metadata: props.array.type.value,
                attribute: {},
            }),
        },
        tags: props.array.tags,
    });
    if (props.array.type.recursive === true) {
        const out = () => [
            {
                $ref: `#/components/schemas/${props.array.type.name}`,
            },
        ];
        if (props.components.schemas?.[props.array.type.name] !== undefined)
            return out();
        props.components.schemas ??= {};
        props.components.schemas[props.array.type.name] ??= {};
        const oneOf = factory();
        Object.assign(props.components.schemas[props.array.type.name], oneOf.length === 1 ? oneOf[0] : { oneOf });
        return out();
    }
    return factory();
};

export { json_schema_array };
//# sourceMappingURL=json_schema_array.mjs.map
