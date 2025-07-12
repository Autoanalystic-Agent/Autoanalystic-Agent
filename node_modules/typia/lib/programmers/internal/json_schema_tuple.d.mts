import { OpenApi } from "@samchon/openapi";
import { MetadataTuple } from "../../schemas/metadata/MetadataTuple";
export declare const json_schema_tuple: (props: {
    components: OpenApi.IComponents;
    tuple: MetadataTuple;
}) => OpenApi.IJsonSchema.ITuple;
