import ts from "typescript";
import { Metadata } from "../../schemas/metadata/Metadata";
import { MetadataArray } from "../../schemas/metadata/MetadataArray";
import { MetadataMap } from "../../schemas/metadata/MetadataMap";
import { MetadataObjectType } from "../../schemas/metadata/MetadataObjectType";
import { MetadataSet } from "../../schemas/metadata/MetadataSet";
import { MetadataTuple } from "../../schemas/metadata/MetadataTuple";
import { FeatureProgrammer } from "../FeatureProgrammer";
import { check_union_array_like } from "../internal/check_union_array_like";
export declare namespace UnionExplorer {
    interface Decoder<T> {
        (props: {
            input: ts.Expression;
            definition: T;
            explore: FeatureProgrammer.IExplore;
        }): ts.Expression;
    }
    type ObjectCombiner = Decoder<MetadataObjectType[]>;
    const object: (props: {
        config: FeatureProgrammer.IConfig;
        level?: number;
        objects: MetadataObjectType[];
        input: ts.Expression;
        explore: FeatureProgrammer.IExplore;
    }) => ts.Expression;
    const tuple: (props: {
        config: check_union_array_like.IConfig<MetadataTuple, MetadataTuple>;
        parameters: ts.ParameterDeclaration[];
        input: ts.Expression;
        tuples: MetadataTuple[];
        explore: FeatureProgrammer.IExplore;
    }) => ts.ArrowFunction;
    namespace tuple {
        type IConfig = check_union_array_like.IConfig<MetadataTuple, MetadataTuple>;
    }
    const array: (props: {
        config: array.IConfig;
        parameters: ts.ParameterDeclaration[];
        input: ts.Expression;
        arrays: MetadataArray[];
        explore: FeatureProgrammer.IExplore;
    }) => ts.ArrowFunction;
    namespace array {
        type IConfig = check_union_array_like.IConfig<MetadataArray, Metadata>;
    }
    const array_or_tuple: (props: {
        config: array_or_tuple.IConfig;
        parameters: ts.ParameterDeclaration[];
        input: ts.Expression;
        definitions: (MetadataArray | MetadataTuple)[];
        explore: FeatureProgrammer.IExplore;
    }) => ts.ArrowFunction;
    namespace array_or_tuple {
        type IConfig = check_union_array_like.IConfig<MetadataArray | MetadataTuple, Metadata | MetadataTuple>;
    }
    const set: (props: {
        config: set.IConfig;
        parameters: ts.ParameterDeclaration[];
        input: ts.Expression;
        sets: MetadataSet[];
        explore: FeatureProgrammer.IExplore;
    }) => ts.ArrowFunction;
    namespace set {
        type IConfig = check_union_array_like.IConfig<MetadataArray, Metadata>;
    }
    const map: (props: {
        config: map.IConfig;
        parameters: ts.ParameterDeclaration[];
        input: ts.Expression;
        maps: MetadataMap[];
        explore: FeatureProgrammer.IExplore;
    }) => ts.ArrowFunction;
    namespace map {
        type IConfig = check_union_array_like.IConfig<MetadataArray, [
            Metadata,
            Metadata
        ]>;
    }
}
