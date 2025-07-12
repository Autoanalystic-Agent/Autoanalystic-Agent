export interface IMetadataTypeTag {
    target: "boolean" | "bigint" | "number" | "string" | "array" | "object";
    name: string;
    kind: string;
    exclusive: boolean | string[];
    value?: any;
    validate?: string | undefined;
    schema?: object | undefined;
}
