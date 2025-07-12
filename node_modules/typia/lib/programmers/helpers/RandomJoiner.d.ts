import { OpenApi } from "@samchon/openapi";
import ts from "typescript";
import { Metadata } from "../../schemas/metadata/Metadata";
import { MetadataArrayType } from "../../schemas/metadata/MetadataArrayType";
import { MetadataObjectType } from "../../schemas/metadata/MetadataObjectType";
export declare namespace RandomJoiner {
    type Decoder = (metadata: Metadata) => ts.Expression;
    const array: (props: {
        decode: Decoder;
        recursive: boolean;
        expression: ts.Expression;
        array: MetadataArrayType;
        schema: Omit<OpenApi.IJsonSchema.IArray, "items"> | undefined;
    }) => ts.Expression;
    const tuple: (props: {
        decode: Decoder;
        elements: Metadata[];
    }) => ts.ArrayLiteralExpression;
    const object: (props: {
        decode: Decoder;
        object: MetadataObjectType;
    }) => ts.ConciseBody;
}
