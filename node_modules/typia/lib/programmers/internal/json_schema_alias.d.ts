import { OpenApi } from "@samchon/openapi";
import { MetadataAlias } from "../../schemas/metadata/MetadataAlias";
export declare const json_schema_alias: <BlockNever extends boolean>(props: {
    blockNever: BlockNever;
    components: OpenApi.IComponents;
    alias: MetadataAlias;
}) => OpenApi.IJsonSchema.IReference[];
