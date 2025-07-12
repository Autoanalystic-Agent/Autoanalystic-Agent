import { OpenApi } from "@samchon/openapi";
import { MetadataNative } from "../../schemas/metadata/MetadataNative";
export declare const json_schema_native: (props: {
    components: OpenApi.IComponents;
    native: MetadataNative;
}) => OpenApi.IJsonSchema[];
