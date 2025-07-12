import ts from "typescript";
import { MetadataCollection } from "../factories/MetadataCollection";
import { Metadata } from "../schemas/metadata/Metadata";
import { MetadataObjectType } from "../schemas/metadata/MetadataObjectType";
import { IProgrammerProps } from "../transformers/IProgrammerProps";
import { ITypiaContext } from "../transformers/ITypiaContext";
import { CheckerProgrammer } from "./CheckerProgrammer";
import { FeatureProgrammer } from "./FeatureProgrammer";
import { FunctionProgrammer } from "./helpers/FunctionProgrammer";
import { IExpressionEntry } from "./helpers/IExpressionEntry";
export declare namespace IsProgrammer {
    const configure: (props: {
        options?: Partial<CONFIG.IOptions>;
        context: ITypiaContext;
        functor: FunctionProgrammer;
    }) => CheckerProgrammer.IConfig;
    namespace CONFIG {
        interface IOptions {
            numeric: boolean;
            undefined: boolean;
            object: (props: {
                input: ts.Expression;
                entries: IExpressionEntry<ts.Expression>[];
            }) => ts.Expression;
        }
    }
    interface IConfig {
        equals: boolean;
    }
    interface IProps extends IProgrammerProps {
        config: IConfig;
    }
    const decompose: (props: {
        context: ITypiaContext;
        functor: FunctionProgrammer;
        config: IConfig;
        type: ts.Type;
        name: string | undefined;
    }) => FeatureProgrammer.IDecomposed;
    const write: (props: IProps) => ts.CallExpression;
    const write_function_statements: (props: {
        context: ITypiaContext;
        functor: FunctionProgrammer;
        collection: MetadataCollection;
    }) => ts.VariableStatement[];
    const decode: (props: {
        context: ITypiaContext;
        functor: FunctionProgrammer;
        metadata: Metadata;
        input: ts.Expression;
        explore: CheckerProgrammer.IExplore;
    }) => ts.Expression;
    const decode_object: (props: {
        context: ITypiaContext;
        functor: FunctionProgrammer;
        object: MetadataObjectType;
        input: ts.Expression;
        explore: FeatureProgrammer.IExplore;
    }) => ts.CallExpression;
    const decode_to_json: (props: {
        input: ts.Expression;
        checkNull: boolean;
    }) => ts.Expression;
    const decode_functional: (input: ts.Expression) => ts.BinaryExpression;
}
