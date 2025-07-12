import ts from "typescript";
import { IProgrammerProps } from "../../transformers/IProgrammerProps";
import { ITypiaContext } from "../../transformers/ITypiaContext";
import { FeatureProgrammer } from "../FeatureProgrammer";
import { FunctionProgrammer } from "../helpers/FunctionProgrammer";
export declare namespace HttpValidateQueryProgrammer {
    interface IProps extends IProgrammerProps {
        allowOptional?: boolean;
    }
    const decompose: (props: {
        context: ITypiaContext;
        modulo: ts.LeftHandSideExpression;
        functor: FunctionProgrammer;
        type: ts.Type;
        name: string | undefined;
        allowOptional: boolean;
    }) => FeatureProgrammer.IDecomposed;
    const write: (props: IProps) => ts.CallExpression;
}
