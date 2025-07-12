import { OpenApi } from "../OpenApi";
import { OpenApiV3 } from "../OpenApiV3";
export declare namespace OpenApiV3Downgrader {
    interface IComponentsCollection {
        original: OpenApi.IComponents;
        downgraded: OpenApiV3.IComponents;
    }
    const downgrade: (input: OpenApi.IDocument) => OpenApiV3.IDocument;
    const downgradeComponents: (input: OpenApi.IComponents) => IComponentsCollection;
    const downgradeSchema: (collection: IComponentsCollection) => (input: OpenApi.IJsonSchema) => OpenApiV3.IJsonSchema;
}
