import { IMetadataComponents } from "./IMetadataComponents";
import { IMetadataDictionary } from "./IMetadataDictionary";
import { MetadataAliasType } from "./MetadataAliasType";
import { MetadataArrayType } from "./MetadataArrayType";
import { MetadataObjectType } from "./MetadataObjectType";
import { MetadataTupleType } from "./MetadataTupleType";
export declare class MetadataComponents {
    readonly aliases: MetadataAliasType[];
    readonly objects: MetadataObjectType[];
    readonly arrays: MetadataArrayType[];
    readonly tuples: MetadataTupleType[];
    readonly dictionary: IMetadataDictionary;
    private constructor();
    static from(json: IMetadataComponents): MetadataComponents;
    toJSON(): IMetadataComponents;
}
