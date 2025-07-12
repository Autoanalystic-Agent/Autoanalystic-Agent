import { json_schema_station } from './json_schema_station.mjs';

const json_schema_tuple = (props) => {
    const tail = props.tuple.type.elements.at(-1)?.rest ?? null;
    const prefixItems = props.tuple.type.isRest()
        ? props.tuple.type.elements.slice(0, -1)
        : props.tuple.type.elements;
    return {
        type: "array",
        prefixItems: prefixItems.map((metadata) => json_schema_station({
            blockNever: false,
            components: props.components,
            metadata,
            attribute: {},
        })),
        additionalItems: tail
            ? json_schema_station({
                blockNever: false,
                components: props.components,
                metadata: tail,
                attribute: {},
            })
            : false,
    };
};

export { json_schema_tuple };
//# sourceMappingURL=json_schema_tuple.mjs.map
