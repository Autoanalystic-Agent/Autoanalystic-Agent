import { OpenApi } from "../OpenApi";
import { SwaggerV2 } from "../SwaggerV2";
export declare namespace SwaggerV2Downgrader {
    interface IComponentsCollection {
        original: OpenApi.IComponents;
        downgraded: Record<string, SwaggerV2.IJsonSchema>;
    }
    const downgrade: (input: OpenApi.IDocument) => SwaggerV2.IDocument;
    const downgradeComponents: (input: OpenApi.IComponents) => IComponentsCollection;
    const downgradeSchema: (collection: IComponentsCollection) => (input: OpenApi.IJsonSchema) => SwaggerV2.IJsonSchema;
}
