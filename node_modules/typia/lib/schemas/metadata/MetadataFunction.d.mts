import { IMetadataDictionary } from "./IMetadataDictionary";
import { IMetadataFunction } from "./IMetadataFunction";
import { Metadata } from "./Metadata";
import { MetadataParameter } from "./MetadataParameter";
export declare class MetadataFunction {
    parameters: MetadataParameter[];
    output: Metadata;
    async: boolean;
    /**
     * @hidden
     */
    private constructor();
    static from(json: IMetadataFunction, dict: IMetadataDictionary): MetadataFunction;
    toJSON(): IMetadataFunction;
}
