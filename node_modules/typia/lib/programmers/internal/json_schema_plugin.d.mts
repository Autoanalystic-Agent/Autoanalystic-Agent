import { OpenApi } from "@samchon/openapi";
import { IMetadataTypeTag } from "../../schemas/metadata/IMetadataTypeTag";
export declare const json_schema_plugin: <Schema extends OpenApi.IJsonSchema>(props: {
    schema: Schema;
    tags: IMetadataTypeTag[][];
}) => Schema[];
