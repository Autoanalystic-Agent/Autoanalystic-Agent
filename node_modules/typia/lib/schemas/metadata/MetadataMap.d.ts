import { ClassProperties } from "../../typings/ClassProperties";
import { IMetadataMap } from "./IMetadataMap";
import { IMetadataTypeTag } from "./IMetadataTypeTag";
import { Metadata } from "./Metadata";
export declare class MetadataMap {
    readonly key: Metadata;
    readonly value: Metadata;
    readonly tags: IMetadataTypeTag[][];
    private name_?;
    private constructor();
    static create(props: ClassProperties<MetadataMap>): MetadataMap;
    getName(): string;
    toJSON(): IMetadataMap;
}
