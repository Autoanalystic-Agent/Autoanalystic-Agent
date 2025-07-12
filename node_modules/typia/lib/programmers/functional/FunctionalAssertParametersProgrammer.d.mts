import ts from "typescript";
import { ITypiaContext } from "../../transformers/ITypiaContext";
export declare namespace FunctionalAssertParametersProgrammer {
    interface IConfig {
        equals: boolean;
    }
    interface IProps {
        context: ITypiaContext;
        modulo: ts.LeftHandSideExpression;
        config: IConfig;
        declaration: ts.FunctionDeclaration;
        expression: ts.Expression;
        init?: ts.Expression | undefined;
    }
    interface IDecomposeProps {
        context: ITypiaContext;
        config: IConfig;
        modulo: ts.LeftHandSideExpression;
        parameters: readonly ts.ParameterDeclaration[];
        wrapper: string;
    }
    interface IDecomposeOutput {
        functions: ts.Statement[];
        expressions: ts.Expression[];
    }
    const write: (props: IProps) => ts.CallExpression;
    const decompose: (props: IDecomposeProps) => IDecomposeOutput;
}
