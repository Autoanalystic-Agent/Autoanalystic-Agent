import ts from "typescript";
import { IProgrammerProps } from "../../transformers/IProgrammerProps";
import { ITypiaContext } from "../../transformers/ITypiaContext";
import { FeatureProgrammer } from "../FeatureProgrammer";
import { FunctionProgrammer } from "../helpers/FunctionProgrammer";
export declare namespace NotationAssertGeneralProgrammer {
    interface IProps extends IProgrammerProps {
        rename: (str: string) => string;
    }
    const decompose: (props: {
        rename: (str: string) => string;
        context: ITypiaContext;
        functor: FunctionProgrammer;
        type: ts.Type;
        name: string | undefined;
        init?: ts.Expression | undefined;
    }) => FeatureProgrammer.IDecomposed;
    const write: (props: IProps) => ts.CallExpression;
}
