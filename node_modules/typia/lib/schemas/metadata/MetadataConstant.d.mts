import { ClassProperties } from "../../typings/ClassProperties";
import { IMetadataConstant } from "./IMetadataConstant";
import { MetadataConstantValue } from "./MetadataConstantValue";
export declare class MetadataConstant {
    readonly type: "boolean" | "bigint" | "number" | "string";
    readonly values: MetadataConstantValue[];
    private constructor();
    static create(props: ClassProperties<MetadataConstant>): MetadataConstant;
    static from(json: IMetadataConstant): MetadataConstant;
    toJSON(): IMetadataConstant;
}
