import ts from "typescript";
import { IProgrammerProps } from "../transformers/IProgrammerProps";
import { ITypiaContext } from "../transformers/ITypiaContext";
import { FeatureProgrammer } from "./FeatureProgrammer";
import { FunctionProgrammer } from "./helpers/FunctionProgrammer";
export declare namespace ValidateProgrammer {
    interface IConfig {
        equals: boolean;
        standardSchema?: boolean;
    }
    interface IProps extends IProgrammerProps {
        config: IConfig;
    }
    const decompose: (props: {
        context: ITypiaContext;
        modulo: ts.LeftHandSideExpression;
        functor: FunctionProgrammer;
        config: IConfig;
        type: ts.Type;
        name: string | undefined;
    }) => FeatureProgrammer.IDecomposed;
    const write: (props: IProps) => ts.CallExpression;
}
