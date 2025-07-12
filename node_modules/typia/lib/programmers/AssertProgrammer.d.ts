import ts from "typescript";
import { IProgrammerProps } from "../transformers/IProgrammerProps";
import { ITypiaContext } from "../transformers/ITypiaContext";
import { FeatureProgrammer } from "./FeatureProgrammer";
import { FunctionProgrammer } from "./helpers/FunctionProgrammer";
export declare namespace AssertProgrammer {
    interface IConfig {
        equals: boolean;
        guard: boolean;
    }
    interface IProps extends IProgrammerProps {
        config: IConfig;
    }
    const decompose: (props: {
        config: IConfig;
        context: ITypiaContext;
        functor: FunctionProgrammer;
        type: ts.Type;
        name: string | undefined;
        init?: ts.Expression | undefined;
    }) => FeatureProgrammer.IDecomposed;
    const write: (props: IProps) => ts.CallExpression;
    namespace Guardian {
        const identifier: () => ts.Identifier;
        const parameter: (props: {
            context: ITypiaContext;
            init: ts.Expression | undefined;
        }) => ts.ParameterDeclaration;
        const type: (context: ITypiaContext) => ts.FunctionTypeNode;
    }
}
