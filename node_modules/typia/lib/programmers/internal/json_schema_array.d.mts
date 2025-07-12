import { OpenApi } from "@samchon/openapi";
import { MetadataArray } from "../../schemas/metadata/MetadataArray";
export declare const json_schema_array: (props: {
    components: OpenApi.IComponents;
    array: MetadataArray;
}) => Array<OpenApi.IJsonSchema.IArray | OpenApi.IJsonSchema.IReference>;
