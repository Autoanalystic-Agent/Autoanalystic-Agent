import { OpenApi } from "../OpenApi";
export declare namespace OpenApiExclusiveEmender {
    const emend: <Schema extends Pick<OpenApi.IJsonSchema.INumber, "exclusiveMinimum" | "exclusiveMaximum" | "minimum" | "maximum">>(schema: Schema) => Schema;
}
