import { OpenApi } from "../OpenApi";
import { OpenApiV3_1 } from "../OpenApiV3_1";
export declare namespace OpenApiV3_1Emender {
    const convert: (input: OpenApiV3_1.IDocument) => OpenApi.IDocument;
    const convertComponents: (input: OpenApiV3_1.IComponents) => OpenApi.IComponents;
    const convertSchema: (components: OpenApiV3_1.IComponents) => (input: OpenApiV3_1.IJsonSchema) => OpenApi.IJsonSchema;
}
