import { MetadataObjectType } from "../../schemas/metadata/MetadataObjectType";
import { MetadataProperty } from "../../schemas/metadata/MetadataProperty";
export declare namespace UnionPredicator {
    interface ISpecialized {
        index: number;
        object: MetadataObjectType;
        property: MetadataProperty;
        neighbor: boolean;
    }
    const object: (objects: MetadataObjectType[]) => Array<ISpecialized>;
}
