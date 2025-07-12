import { OpenApi } from "../../OpenApi";
import { IOpenApiValidatorContext } from "./IOpenApiValidatorContext";
export declare namespace OpenApiStringValidator {
    const validate: (ctx: IOpenApiValidatorContext<OpenApi.IJsonSchema.IString>) => boolean;
}
