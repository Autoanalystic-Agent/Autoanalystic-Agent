import { OpenApi } from "../../OpenApi";
import { IOpenApiValidatorContext } from "./IOpenApiValidatorContext";
export declare namespace OpenApiTupleValidator {
    const validate: (ctx: IOpenApiValidatorContext<OpenApi.IJsonSchema.ITuple>) => boolean;
}
