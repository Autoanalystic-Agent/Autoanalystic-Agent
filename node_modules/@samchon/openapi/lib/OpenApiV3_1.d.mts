import { IJsonSchemaAttribute } from "./structures/IJsonSchemaAttribute";
/**
 * OpenAPI v3.1 definition.
 *
 * @author Jeongho Nam - https://github.com/samchon
 */
export declare namespace OpenApiV3_1 {
    type Method = "get" | "post" | "put" | "delete" | "options" | "head" | "patch" | "trace";
    interface IDocument {
        openapi: `3.1.${number}`;
        servers?: IServer[];
        info?: IDocument.IInfo;
        components?: IComponents;
        paths?: Record<string, IPath>;
        webhooks?: Record<string, IJsonSchema.IReference<`#/components/pathItems/${string}`> | IPath>;
        security?: Record<string, string[]>[];
        tags?: IDocument.ITag[];
    }
    namespace IDocument {
        interface IInfo {
            title: string;
            summary?: string;
            description?: string;
            termsOfService?: string;
            contact?: IContact;
            license?: ILicense;
            version: string;
        }
        interface ITag {
            name: string;
            description?: string;
        }
        interface IContact {
            name?: string;
            url?: string;
            email?: string;
        }
        interface ILicense {
            name: string;
            identifier?: string;
            url?: string;
        }
    }
    interface IServer {
        url: string;
        description?: string;
        variables?: Record<string, IServer.IVariable>;
    }
    namespace IServer {
        interface IVariable {
            default: string;
            /** @minItems 1 */ enum?: string[];
            description?: string;
        }
    }
    interface IPath extends Partial<Record<Method, IOperation>> {
        parameters?: Array<IOperation.IParameter | IJsonSchema.IReference<`#/components/headers/${string}`> | IJsonSchema.IReference<`#/components/parameters/${string}`>>;
        servers?: IServer[];
        summary?: string;
        description?: string;
    }
    interface IOperation {
        operationId?: string;
        parameters?: Array<IOperation.IParameter | IJsonSchema.IReference<`#/components/headers/${string}`> | IJsonSchema.IReference<`#/components/parameters/${string}`>>;
        requestBody?: IOperation.IRequestBody | IJsonSchema.IReference<`#/components/requestBodies/${string}`>;
        responses?: Record<string, IOperation.IResponse | IJsonSchema.IReference<`#/components/responses/${string}`>>;
        servers?: IServer[];
        summary?: string;
        description?: string;
        security?: Record<string, string[]>[];
        tags?: string[];
        deprecated?: boolean;
    }
    namespace IOperation {
        interface IParameter {
            name?: string;
            in: "path" | "query" | "header" | "cookie";
            schema: IJsonSchema;
            required?: boolean;
            description?: string;
            example?: any;
            examples?: Record<string, IExample | IJsonSchema.IReference<`#/components/examples/${string}`>>;
        }
        interface IRequestBody {
            description?: string;
            required?: boolean;
            content?: Record<string, IMediaType>;
        }
        interface IResponse {
            content?: Record<string, IMediaType>;
            headers?: Record<string, Omit<IOperation.IParameter, "in"> | IJsonSchema.IReference<`#/components/headers/${string}`>>;
            description?: string;
        }
        interface IMediaType {
            schema?: IJsonSchema;
            example?: any;
            examples?: Record<string, IExample | IJsonSchema.IReference<`#/components/examples/${string}`>>;
        }
    }
    interface IExample {
        summary?: string;
        description?: string;
        value?: any;
        externalValue?: string;
    }
    interface IComponents {
        schemas?: Record<string, IJsonSchema>;
        pathItems?: Record<string, IPath>;
        responses?: Record<string, IOperation.IResponse>;
        parameters?: Record<string, IOperation.IParameter>;
        requestBodies?: Record<string, IOperation.IRequestBody>;
        securitySchemes?: Record<string, ISecurityScheme>;
        headers?: Record<string, Omit<IOperation.IParameter, "in">>;
        examples?: Record<string, IExample>;
    }
    type IJsonSchema = IJsonSchema.IMixed | IJsonSchema.IConstant | IJsonSchema.IBoolean | IJsonSchema.IInteger | IJsonSchema.INumber | IJsonSchema.IString | IJsonSchema.IArray | IJsonSchema.IObject | IJsonSchema.IReference | IJsonSchema.IRecursiveReference | IJsonSchema.IAllOf | IJsonSchema.IAnyOf | IJsonSchema.IOneOf | IJsonSchema.INull | IJsonSchema.IUnknown;
    namespace IJsonSchema {
        interface IMixed extends IConstant, Omit<IBoolean, "type" | "default" | "enum">, Omit<INumber, "type" | "default" | "enum">, Omit<IString, "type" | "default" | "enum">, Omit<IArray, "type">, Omit<IObject, "type">, IOneOf, IAnyOf, IAllOf, IReference {
            type: Array<"boolean" | "integer" | "number" | "string" | "array" | "object" | "null">;
            default?: any[] | null;
            enum?: any[];
        }
        interface IConstant extends __IAttribute {
            const: boolean | number | string;
            nullable?: boolean;
        }
        interface IBoolean extends Omit<IJsonSchemaAttribute.IBoolean, "examples">, __IAttribute {
            nullable?: boolean;
            default?: boolean | null;
            enum?: Array<boolean | null>;
        }
        interface IInteger extends Omit<IJsonSchemaAttribute.IInteger, "examples">, __IAttribute {
            nullable?: boolean;
            /** @type int64 */ default?: number | null;
            /** @type int64 */ enum?: Array<number | null>;
            /** @type int64 */ minimum?: number;
            /** @type int64 */ maximum?: number;
            /** @type int64 */ exclusiveMinimum?: number | boolean;
            /** @type int64 */ exclusiveMaximum?: number | boolean;
            /**
             * @type uint64
             * @exclusiveMinimum 0
             */
            multipleOf?: number;
        }
        interface INumber extends Omit<IJsonSchemaAttribute.INumber, "examples">, __IAttribute {
            nullable?: boolean;
            default?: number | null;
            enum?: Array<number | null>;
            minimum?: number;
            maximum?: number;
            exclusiveMinimum?: number | boolean;
            exclusiveMaximum?: number | boolean;
            /** @exclusiveMinimum 0 */ multipleOf?: number;
        }
        interface IString extends Omit<IJsonSchemaAttribute.IString, "examples">, __IAttribute {
            nullable?: boolean;
            default?: string | null;
            enum?: Array<string | null>;
            format?: "binary" | "byte" | "password" | "regex" | "uuid" | "email" | "hostname" | "idn-email" | "idn-hostname" | "iri" | "iri-reference" | "ipv4" | "ipv6" | "uri" | "uri-reference" | "uri-template" | "url" | "date-time" | "date" | "time" | "duration" | "json-pointer" | "relative-json-pointer" | (string & {});
            pattern?: string;
            contentMediaType?: string;
            /** @type uint64 */ minLength?: number;
            /** @type uint64 */ maxLength?: number;
        }
        interface IObject extends Omit<IJsonSchemaAttribute.IObject, "examples">, __IAttribute {
            nullable?: boolean;
            properties?: Record<string, IJsonSchema>;
            required?: string[];
            additionalProperties?: boolean | IJsonSchema;
            maxProperties?: number;
            minProperties?: number;
        }
        interface IArray extends Omit<IJsonSchemaAttribute.IArray, "examples">, __IAttribute {
            nullable?: boolean;
            items?: IJsonSchema | IJsonSchema[];
            prefixItems?: IJsonSchema[];
            uniqueItems?: boolean;
            additionalItems?: boolean | IJsonSchema;
            /** @type uint64 */ minItems?: number;
            /** @type uint64 */ maxItems?: number;
        }
        interface IReference<Key = string> extends __IAttribute {
            $ref: Key;
        }
        interface IRecursiveReference extends __IAttribute {
            $recursiveRef: string;
        }
        interface IAllOf extends __IAttribute {
            allOf: IJsonSchema[];
        }
        interface IAnyOf extends __IAttribute {
            anyOf: IJsonSchema[];
        }
        interface IOneOf extends __IAttribute {
            oneOf: IJsonSchema[];
            discriminator?: IOneOf.IDiscriminator;
        }
        namespace IOneOf {
            interface IDiscriminator {
                propertyName: string;
                mapping?: Record<string, string>;
            }
        }
        interface INull extends Omit<IJsonSchemaAttribute.INull, "examples">, __IAttribute {
            default?: null;
        }
        interface IUnknown extends Omit<IJsonSchemaAttribute.IUnknown, "examples">, __IAttribute {
            type?: undefined;
            default?: any;
        }
        interface __IAttribute extends Omit<IJsonSchemaAttribute, "examples"> {
            examples?: any[] | Record<string, any>;
        }
    }
    type ISecurityScheme = ISecurityScheme.IApiKey | ISecurityScheme.IHttpBasic | ISecurityScheme.IHttpBearer | ISecurityScheme.IOAuth2 | ISecurityScheme.IOpenId;
    namespace ISecurityScheme {
        interface IApiKey {
            type: "apiKey";
            in?: "header" | "query" | "cookie";
            name?: string;
            description?: string;
        }
        interface IHttpBasic {
            type: "http";
            scheme: "basic";
            description?: string;
        }
        interface IHttpBearer {
            type: "http";
            scheme: "bearer";
            bearerFormat?: string;
            description?: string;
        }
        interface IOAuth2 {
            type: "oauth2";
            flows: IOAuth2.IFlowSet;
            description?: string;
        }
        interface IOpenId {
            type: "openIdConnect";
            openIdConnectUrl: string;
            description?: string;
        }
        namespace IOAuth2 {
            interface IFlowSet {
                authorizationCode?: IFlow;
                implicit?: Omit<IFlow, "tokenUrl">;
                password?: Omit<IFlow, "authorizationUrl">;
                clientCredentials?: Omit<IFlow, "authorizationUrl">;
            }
            interface IFlow {
                authorizationUrl?: string;
                tokenUrl?: string;
                refreshUrl?: string;
                scopes?: Record<string, string>;
            }
        }
    }
}
