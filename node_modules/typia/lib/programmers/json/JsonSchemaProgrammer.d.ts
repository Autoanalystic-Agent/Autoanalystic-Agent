import { IJsonSchemaUnit } from "../../schemas/json/IJsonSchemaUnit";
import { Metadata } from "../../schemas/metadata/Metadata";
export declare namespace JsonSchemaProgrammer {
    const validate: (metadata: Metadata) => string[];
    const write: <Version extends "3.0" | "3.1">(props: {
        version: Version;
        metadata: Metadata;
    }) => IJsonSchemaUnit<Version>;
}
