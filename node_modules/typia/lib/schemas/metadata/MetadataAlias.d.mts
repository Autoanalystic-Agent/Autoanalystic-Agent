import { ClassProperties } from "../../typings/ClassProperties";
import { IMetadataAlias } from "./IMetadataAlias";
import { IMetadataTypeTag } from "./IMetadataTypeTag";
import { MetadataAliasType } from "./MetadataAliasType";
export declare class MetadataAlias {
    readonly type: MetadataAliasType;
    readonly tags: IMetadataTypeTag[][];
    private name_?;
    private constructor();
    static create(props: ClassProperties<MetadataAlias>): MetadataAlias;
    getName(): string;
    toJSON(): IMetadataAlias;
}
