import { OpenApi } from "../OpenApi";
import { SwaggerV2 } from "../SwaggerV2";
export declare namespace SwaggerV2Upgrader {
    const convert: (input: SwaggerV2.IDocument) => OpenApi.IDocument;
    const convertSchema: (definitions: Record<string, SwaggerV2.IJsonSchema>) => (input: SwaggerV2.IJsonSchema) => OpenApi.IJsonSchema;
}
