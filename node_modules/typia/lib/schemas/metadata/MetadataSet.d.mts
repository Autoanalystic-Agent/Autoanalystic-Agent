import { ClassProperties } from "../../typings/ClassProperties";
import { IMetadataSet } from "./IMetadataSet";
import { IMetadataTypeTag } from "./IMetadataTypeTag";
import { Metadata } from "./Metadata";
export declare class MetadataSet {
    readonly value: Metadata;
    readonly tags: IMetadataTypeTag[][];
    private name_?;
    private constructor();
    static create(props: ClassProperties<MetadataSet>): MetadataSet;
    getName(): string;
    toJSON(): IMetadataSet;
}
