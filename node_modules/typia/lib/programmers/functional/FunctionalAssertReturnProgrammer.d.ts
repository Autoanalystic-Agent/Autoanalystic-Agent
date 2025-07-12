import ts from "typescript";
import { ITypiaContext } from "../../transformers/ITypiaContext";
export declare namespace FunctionAssertReturnProgrammer {
    interface IConfig {
        equals: boolean;
    }
    interface IProps {
        context: ITypiaContext;
        modulo: ts.LeftHandSideExpression;
        config: IConfig;
        expression: ts.Expression;
        declaration: ts.FunctionDeclaration;
        init?: ts.Expression | undefined;
    }
    interface IDecomposeProps {
        context: ITypiaContext;
        modulo: ts.LeftHandSideExpression;
        config: IConfig;
        expression: ts.Expression;
        declaration: ts.FunctionDeclaration;
        wrapper: string;
    }
    interface IDecomposeOutput {
        async: boolean;
        functions: ts.Statement[];
        value: ts.Expression;
    }
    const write: (props: IProps) => ts.CallExpression;
    const decompose: (props: IDecomposeProps) => IDecomposeOutput;
}
