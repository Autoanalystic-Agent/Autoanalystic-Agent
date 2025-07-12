import { OpenApi } from "../../OpenApi";
import { IOpenApiValidatorContext } from "./IOpenApiValidatorContext";
export declare namespace OpenApiObjectValidator {
    const validate: (ctx: IOpenApiValidatorContext<OpenApi.IJsonSchema.IObject>) => boolean;
}
