import ts from "typescript";
import { IProgrammerProps } from "../../transformers/IProgrammerProps";
import { ITypiaContext } from "../../transformers/ITypiaContext";
import { FeatureProgrammer } from "../FeatureProgrammer";
import { FunctionProgrammer } from "../helpers/FunctionProgrammer";
export declare namespace HttpAssertHeadersProgrammer {
    const decompose: (props: {
        context: ITypiaContext;
        functor: FunctionProgrammer;
        type: ts.Type;
        name: string | undefined;
        init?: ts.Expression | undefined;
    }) => FeatureProgrammer.IDecomposed;
    const write: (props: IProgrammerProps) => ts.CallExpression;
}
