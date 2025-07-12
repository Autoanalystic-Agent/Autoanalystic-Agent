import { OpenApi } from "../OpenApi";
export declare namespace OpenApiConstraintShifter {
    const shiftArray: <Schema extends Pick<OpenApi.IJsonSchema.IArray, "description" | "minItems" | "maxItems" | "uniqueItems">>(schema: Schema) => Omit<Schema, "minItems" | "maxItems" | "uniqueItems">;
    const shiftNumeric: <Schema extends Pick<OpenApi.IJsonSchema.INumber | OpenApi.IJsonSchema.IInteger, "description" | "minimum" | "maximum" | "exclusiveMinimum" | "exclusiveMaximum" | "multipleOf" | "default">>(schema: Schema) => Omit<Schema, "minimum" | "maximum" | "exclusiveMinimum" | "exclusiveMaximum" | "multipleOf" | "default">;
    const shiftString: <Schema extends Pick<OpenApi.IJsonSchema.IString, "description" | "minLength" | "maxLength" | "format" | "pattern" | "contentMediaType" | "default">>(schema: Schema) => Omit<Schema, "minLength" | "maxLength" | "format" | "pattern" | "contentMediaType" | "default">;
}
