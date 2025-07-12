import { ClassProperties } from "../../typings/ClassProperties";
import { IMetadataNative } from "./IMetadataNative";
import { IMetadataTypeTag } from "./IMetadataTypeTag";
export declare class MetadataNative {
    readonly name: string;
    readonly tags: IMetadataTypeTag[][];
    private typeName_?;
    private constructor();
    static create(props: ClassProperties<MetadataNative>): MetadataNative;
    getName(): string;
    toJSON(): IMetadataNative;
}
