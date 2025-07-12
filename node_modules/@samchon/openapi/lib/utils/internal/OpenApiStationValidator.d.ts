import { OpenApi } from "../../OpenApi";
import { IOpenApiValidatorContext } from "./IOpenApiValidatorContext";
export declare namespace OpenApiStationValidator {
    const validate: (ctx: Omit<IOpenApiValidatorContext<OpenApi.IJsonSchema>, "expected">, expected?: string) => boolean;
}
