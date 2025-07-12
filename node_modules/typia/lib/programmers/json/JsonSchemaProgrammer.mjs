import { JsonSchemasProgrammer } from './JsonSchemasProgrammer.mjs';

var JsonSchemaProgrammer;
(function (JsonSchemaProgrammer) {
    JsonSchemaProgrammer.validate = (metadata) => JsonSchemasProgrammer.validate(metadata);
    JsonSchemaProgrammer.write = (props) => {
        const collection = JsonSchemasProgrammer.write({
            version: props.version,
            metadatas: [props.metadata],
        });
        return {
            version: collection.version,
            components: collection.components,
            schema: collection.schemas[0],
        };
    };
})(JsonSchemaProgrammer || (JsonSchemaProgrammer = {}));

export { JsonSchemaProgrammer };
//# sourceMappingURL=JsonSchemaProgrammer.mjs.map
