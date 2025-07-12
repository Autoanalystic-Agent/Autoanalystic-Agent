import { OpenApiV3Downgrader } from '@samchon/openapi/lib/converters/OpenApiV3Downgrader.mjs';
import { TransformerError } from '../../transformers/TransformerError.mjs';
import { AtomicPredicator } from '../helpers/AtomicPredicator.mjs';
import { json_schema_station } from '../internal/json_schema_station.mjs';

var JsonSchemasProgrammer;
(function (JsonSchemasProgrammer) {
    JsonSchemasProgrammer.validate = (metadata) => {
        const output = [];
        if (metadata.atomics.some((a) => a.type === "bigint") ||
            metadata.constants.some((c) => c.type === "bigint"))
            output.push("JSON schema does not support bigint type.");
        if (metadata.tuples.some((t) => t.type.elements.some((e) => e.isRequired() === false)) ||
            metadata.arrays.some((a) => a.type.value.isRequired() === false))
            output.push("JSON schema does not support undefined type in array.");
        if (metadata.maps.length)
            output.push("JSON schema does not support Map type.");
        if (metadata.sets.length)
            output.push("JSON schema does not support Set type.");
        for (const native of metadata.natives)
            if (AtomicPredicator.native(native.name) === false &&
                native.name !== "Date" &&
                native.name !== "Blob" &&
                native.name !== "File")
                output.push(`JSON schema does not support ${native.name} type.`);
        return output;
    };
    JsonSchemasProgrammer.write = (props) => props.version === "3.0"
        ? writeV3_0(props.metadatas)
        : writeV3_1(props.metadatas);
    const writeV3_0 = (metadataList) => {
        const collection = writeV3_1(metadataList);
        const asset = OpenApiV3Downgrader.downgradeComponents(collection.components);
        const caster = OpenApiV3Downgrader.downgradeSchema(asset);
        return {
            version: "3.0",
            components: asset.downgraded,
            schemas: collection.schemas.map(caster),
        };
    };
    const writeV3_1 = (metadataList) => {
        const components = {
            schemas: {},
        };
        const generator = (metadata) => json_schema_station({
            blockNever: true,
            components,
            attribute: {},
            metadata,
        });
        return {
            version: "3.1",
            components,
            schemas: metadataList.map((meta, i) => {
                const schema = generator(meta);
                if (schema === null)
                    throw new TransformerError({
                        code: "typia.json.schemas",
                        message: `invalid type on argument - (${meta.getName()}, ${i})`,
                    });
                return schema;
            }),
        };
    };
})(JsonSchemasProgrammer || (JsonSchemasProgrammer = {}));

export { JsonSchemasProgrammer };
//# sourceMappingURL=JsonSchemasProgrammer.mjs.map
