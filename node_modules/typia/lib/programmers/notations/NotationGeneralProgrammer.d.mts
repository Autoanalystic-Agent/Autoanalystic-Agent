import ts from "typescript";
import { IProgrammerProps } from "../../transformers/IProgrammerProps";
import { ITypiaContext } from "../../transformers/ITypiaContext";
import { FeatureProgrammer } from "../FeatureProgrammer";
import { FunctionProgrammer } from "../helpers/FunctionProgrammer";
export declare namespace NotationGeneralProgrammer {
    interface IProps extends IProgrammerProps {
        rename: (str: string) => string;
    }
    const returnType: (props: {
        rename: (str: string) => string;
        context: ITypiaContext;
        type: string;
    }) => ts.ImportTypeNode;
    const decompose: (props: {
        rename: (str: string) => string;
        validated: boolean;
        context: ITypiaContext;
        functor: FunctionProgrammer;
        type: ts.Type;
        name: string | undefined;
    }) => FeatureProgrammer.IDecomposed;
    const write: (props: IProps) => ts.CallExpression;
}
