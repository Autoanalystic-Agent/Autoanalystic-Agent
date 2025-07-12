import { IJsonSchemaCollection } from "../../schemas/json/IJsonSchemaCollection";
import { Metadata } from "../../schemas/metadata/Metadata";
export declare namespace JsonSchemasProgrammer {
    const validate: (metadata: Metadata) => string[];
    const write: <Version extends "3.0" | "3.1">(props: {
        version: Version;
        metadatas: Array<Metadata>;
    }) => IJsonSchemaCollection<Version>;
}
