import ts from "typescript";
import { IMetadataComponents } from "../schemas/metadata/IMetadataComponents";
import { Metadata } from "../schemas/metadata/Metadata";
import { MetadataAliasType } from "../schemas/metadata/MetadataAliasType";
import { MetadataArrayType } from "../schemas/metadata/MetadataArrayType";
import { MetadataObjectType } from "../schemas/metadata/MetadataObjectType";
import { MetadataTupleType } from "../schemas/metadata/MetadataTupleType";
export declare class MetadataCollection {
    private options?;
    private objects_;
    private object_unions_;
    private aliases_;
    private arrays_;
    private tuples_;
    private names_;
    private object_index_;
    private recursive_array_index_;
    private recursive_tuple_index_;
    constructor(options?: Partial<MetadataCollection.IOptions> | undefined);
    clone(): MetadataCollection;
    aliases(): MetadataAliasType[];
    objects(): MetadataObjectType[];
    unions(): MetadataObjectType[][];
    arrays(): MetadataArrayType[];
    tuples(): MetadataTupleType[];
    private getName;
    emplace(checker: ts.TypeChecker, type: ts.Type): [MetadataObjectType, boolean];
    emplaceAlias(checker: ts.TypeChecker, type: ts.Type, symbol: ts.Symbol): [MetadataAliasType, boolean, (meta: Metadata) => void];
    emplaceArray(checker: ts.TypeChecker, type: ts.Type): [MetadataArrayType, boolean, (meta: Metadata) => void];
    emplaceTuple(checker: ts.TypeChecker, type: ts.TupleType): [MetadataTupleType, boolean, (elements: Metadata[]) => void];
    setTupleRecursive(tuple: MetadataTupleType, recursive: boolean): void;
    toJSON(): IMetadataComponents;
}
export declare namespace MetadataCollection {
    interface IOptions {
        replace?(str: string): string;
    }
    const replace: (str: string) => string;
    const escape: (str: string) => string;
}
