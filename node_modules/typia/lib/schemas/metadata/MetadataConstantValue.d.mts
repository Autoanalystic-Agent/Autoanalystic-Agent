import { ClassProperties } from "../../typings/ClassProperties";
import { IJsDocTagInfo } from "./IJsDocTagInfo";
import { IMetadataConstantValue } from "./IMetadataConstantValue";
import { IMetadataTypeTag } from "./IMetadataTypeTag";
export declare class MetadataConstantValue {
    readonly value: boolean | bigint | number | string;
    tags: IMetadataTypeTag[][];
    readonly description?: string | null;
    readonly jsDocTags?: IJsDocTagInfo[];
    private name_?;
    private constructor();
    static create(props: ClassProperties<MetadataConstantValue>): MetadataConstantValue;
    static from(json: IMetadataConstantValue<any>): MetadataConstantValue;
    getName(): string;
    toJSON(): IMetadataConstantValue<any>;
}
