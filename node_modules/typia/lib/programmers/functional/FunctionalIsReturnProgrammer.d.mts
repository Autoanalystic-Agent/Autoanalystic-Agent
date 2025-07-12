import ts from "typescript";
import { ITypiaContext } from "../../transformers/ITypiaContext";
export declare namespace FunctionalIsReturnProgrammer {
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
        modulo: ts.LeftHandSideExpression;
        config: IConfig;
        expression: ts.Expression;
        declaration: ts.FunctionDeclaration;
    }
    interface IDecomposeOutput {
        async: boolean;
        functions: ts.Statement[];
        statements: ts.Statement[];
    }
    const write: (props: IProps) => ts.CallExpression;
    const decompose: (props: IDecomposeProps) => IDecomposeOutput;
}
