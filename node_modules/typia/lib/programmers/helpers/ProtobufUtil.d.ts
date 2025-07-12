import { IMetadataTypeTag } from "../../schemas/metadata/IMetadataTypeTag";
import { Metadata } from "../../schemas/metadata/Metadata";
import { MetadataObjectType } from "../../schemas/metadata/MetadataObjectType";
import { ProtobufAtomic } from "../../typings/ProtobufAtomic";
export declare namespace ProtobufUtil {
    const isStaticObject: (obj: MetadataObjectType) => boolean;
    const size: (meta: Metadata) => number;
    const getSequence: (tags: IMetadataTypeTag[]) => number | null;
    const isUnion: (meta: Metadata) => boolean;
    const getAtomics: (meta: Metadata, union?: Map<string, number | null>) => Map<string, number | null>;
    const getNumbers: (meta: Metadata, union?: Map<string, number | null>) => Map<string, number | null>;
    const getBigints: (meta: Metadata, union?: Map<string, number | null>) => Map<string, number | null>;
    const compare: (x: ProtobufAtomic, y: ProtobufAtomic) => number;
}
