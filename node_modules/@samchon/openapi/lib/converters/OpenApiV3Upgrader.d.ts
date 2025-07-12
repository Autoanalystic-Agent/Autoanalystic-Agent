import { OpenApi } from "../OpenApi";
import { OpenApiV3 } from "../OpenApiV3";
export declare namespace OpenApiV3Upgrader {
    const convert: (input: OpenApiV3.IDocument) => OpenApi.IDocument;
    const convertComponents: (input: OpenApiV3.IComponents) => OpenApi.IComponents;
    const convertSchema: (components: OpenApiV3.IComponents) => (input: OpenApiV3.IJsonSchema) => OpenApi.IJsonSchema;
    namespace TypeChecker {
        const isBoolean: (schema: OpenApiV3.IJsonSchema) => schema is OpenApiV3.IJsonSchema.IBoolean;
        const isInteger: (schema: OpenApiV3.IJsonSchema) => schema is OpenApiV3.IJsonSchema.IInteger;
        const isNumber: (schema: OpenApiV3.IJsonSchema) => schema is OpenApiV3.IJsonSchema.INumber;
        const isString: (schema: OpenApiV3.IJsonSchema) => schema is OpenApiV3.IJsonSchema.IString;
        const isArray: (schema: OpenApiV3.IJsonSchema) => schema is OpenApiV3.IJsonSchema.IArray;
        const isObject: (schema: OpenApiV3.IJsonSchema) => schema is OpenApiV3.IJsonSchema.IObject;
        const isReference: (schema: OpenApiV3.IJsonSchema) => schema is OpenApiV3.IJsonSchema.IReference;
        const isAllOf: (schema: OpenApiV3.IJsonSchema) => schema is OpenApiV3.IJsonSchema.IAllOf;
        const isAnyOf: (schema: OpenApiV3.IJsonSchema) => schema is OpenApiV3.IJsonSchema.IAnyOf;
        const isOneOf: (schema: OpenApiV3.IJsonSchema) => schema is OpenApiV3.IJsonSchema.IOneOf;
        const isNullOnly: (schema: OpenApiV3.IJsonSchema) => schema is OpenApiV3.IJsonSchema.INullOnly;
    }
}
