import ts from "typescript";
import { ITypiaContext } from "../transformers/ITypiaContext";
import { FeatureProgrammer } from "./FeatureProgrammer";
import { FunctionProgrammer } from "./helpers/FunctionProgrammer";
export declare namespace RandomProgrammer {
    interface IProps {
        context: ITypiaContext;
        modulo: ts.LeftHandSideExpression;
        type: ts.Type;
        name: string | undefined;
        init: ts.Expression | undefined;
    }
    interface IDecomposeProps {
        context: ITypiaContext;
        functor: FunctionProgrammer;
        type: ts.Type;
        name: string | undefined;
        init: ts.Expression | undefined;
    }
    const decompose: (props: IDecomposeProps) => FeatureProgrammer.IDecomposed;
    const write: (props: IProps) => ts.CallExpression;
}
