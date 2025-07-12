import { ClassProperties } from "../../typings/ClassProperties";
import { IMetadataDictionary } from "./IMetadataDictionary";
import { IMetadataTemplate } from "./IMetadataTemplate";
import { IMetadataTypeTag } from "./IMetadataTypeTag";
import { Metadata } from "./Metadata";
export declare class MetadataTemplate {
    readonly row: Metadata[];
    readonly tags: IMetadataTypeTag[][];
    private name_?;
    private constructor();
    static create(props: ClassProperties<MetadataTemplate>): MetadataTemplate;
    static from(json: IMetadataTemplate, dict: IMetadataDictionary): MetadataTemplate;
    getName(): string;
    toJSON(): IMetadataTemplate;
}
