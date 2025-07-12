import ts from "typescript";
import { MetadataCollection } from "../factories/MetadataCollection";
import { Metadata } from "../schemas/metadata/Metadata";
import { MetadataObjectType } from "../schemas/metadata/MetadataObjectType";
import { ITypiaContext } from "../transformers/ITypiaContext";
import { FeatureProgrammer } from "./FeatureProgrammer";
import { FunctionProgrammer } from "./helpers/FunctionProgrammer";
import { ICheckEntry } from "./helpers/ICheckEntry";
import { IExpressionEntry } from "./helpers/IExpressionEntry";
export declare namespace CheckerProgrammer {
    interface IConfig {
        prefix: string;
        path: boolean;
        trace: boolean;
        equals: boolean;
        numeric: boolean;
        addition?: () => ts.Statement[];
        decoder?: (props: {
            metadata: Metadata;
            input: ts.Expression;
            explore: IExplore;
        }) => ts.Expression;
        combiner: IConfig.Combiner;
        atomist: (props: {
            entry: ICheckEntry;
            input: ts.Expression;
            explore: IExplore;
        }) => ts.Expression;
        joiner: IConfig.IJoiner;
        success: ts.Expression;
    }
    namespace IConfig {
        interface Combiner {
            (props: {
                explore: IExplore;
                logic: "and" | "or";
                input: ts.Expression;
                binaries: IBinary[];
                expected: string;
            }): ts.Expression;
        }
        interface IJoiner {
            object(props: {
                input: ts.Expression;
                entries: IExpressionEntry<ts.Expression>[];
            }): ts.Expression;
            array(props: {
                input: ts.Expression;
                arrow: ts.ArrowFunction;
            }): ts.Expression;
            tuple?: undefined | ((exprs: ts.Expression[]) => ts.Expression);
            failure(props: {
                input: ts.Expression;
                expected: string;
                explore?: undefined | FeatureProgrammer.IExplore;
            }): ts.Expression;
            is?(expression: ts.Expression): ts.Expression;
            required?(exp: ts.Expression): ts.Expression;
            full?: undefined | ((props: {
                condition: ts.Expression;
                input: ts.Expression;
                expected: string;
                explore: IExplore;
            }) => ts.Expression);
        }
    }
    type IExplore = FeatureProgrammer.IExplore;
    interface IBinary {
        expression: ts.Expression;
        combined: boolean;
    }
    const compose: (props: {
        context: ITypiaContext;
        config: IConfig;
        functor: FunctionProgrammer;
        type: ts.Type;
        name: string | undefined;
    }) => FeatureProgrammer.IComposed;
    const write: (props: {
        context: ITypiaContext;
        config: IConfig;
        functor: FunctionProgrammer;
        type: ts.Type;
        name?: string;
    }) => ts.ArrowFunction;
    const write_object_functions: (props: {
        context: ITypiaContext;
        config: IConfig;
        functor: FunctionProgrammer;
        collection: MetadataCollection;
    }) => ts.VariableStatement[];
    const write_union_functions: (props: {
        context: ITypiaContext;
        config: IConfig;
        functor: FunctionProgrammer;
        collection: MetadataCollection;
    }) => ts.VariableStatement[];
    const write_array_functions: (props: {
        context: ITypiaContext;
        config: IConfig;
        functor: FunctionProgrammer;
        collection: MetadataCollection;
    }) => ts.VariableStatement[];
    const write_tuple_functions: (props: {
        context: ITypiaContext;
        config: IConfig;
        functor: FunctionProgrammer;
        collection: MetadataCollection;
    }) => ts.VariableStatement[];
    const decode: (props: {
        context: ITypiaContext;
        config: IConfig;
        functor: FunctionProgrammer;
        input: ts.Expression;
        metadata: Metadata;
        explore: IExplore;
    }) => ts.Expression;
    const decode_object: (props: {
        config: IConfig;
        functor: FunctionProgrammer;
        object: MetadataObjectType;
        input: ts.Expression;
        explore: IExplore;
    }) => ts.CallExpression;
}
