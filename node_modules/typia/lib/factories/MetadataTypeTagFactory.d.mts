import { IMetadataTypeTag } from "../schemas/metadata/IMetadataTypeTag";
import { MetadataObjectType } from "../schemas/metadata/MetadataObjectType";
import { MetadataFactory } from "./MetadataFactory";
export declare namespace MetadataTypeTagFactory {
    const is: (obj: MetadataObjectType) => boolean;
    const analyze: (props: {
        errors: MetadataFactory.IError[];
        type: "boolean" | "bigint" | "number" | "string" | "array" | "object";
        objects: MetadataObjectType[];
        explore: MetadataFactory.IExplore;
    }) => IMetadataTypeTag[];
    const validate: (props: {
        report: (next: {
            property: string | null;
            message: string;
        }) => false;
        type: "boolean" | "bigint" | "number" | "string" | "array" | "object";
        tags: IMetadataTypeTag[];
    }) => boolean;
}
