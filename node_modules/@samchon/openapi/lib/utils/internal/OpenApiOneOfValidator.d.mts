import { OpenApi } from "../../OpenApi";
import { IOpenApiValidatorContext } from "./IOpenApiValidatorContext";
export declare namespace OpenApiOneOfValidator {
    const validate: (ctx: IOpenApiValidatorContext<OpenApi.IJsonSchema.IOneOf>) => boolean;
}
