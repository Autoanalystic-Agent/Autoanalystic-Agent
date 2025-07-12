import ts from "typescript";
import { ITypiaContext } from "../../transformers/ITypiaContext";
export declare namespace FunctionalIsParametersProgrammer {
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
        declaration: ts.FunctionDeclaration;
    }
    interface IDecomposeOutput {
        functions: ts.Statement[];
        statements: ts.Statement[];
    }
    const write: (props: IProps) => ts.CallExpression;
    const decompose: (props: IDecomposeProps) => IDecomposeOutput;
}
