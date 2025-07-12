import ts from "typescript";
import { ITypiaContext } from "../../transformers/ITypiaContext";
export declare namespace FunctionalValidateFunctionProgrammer {
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
    const write: (props: IProps) => ts.CallExpression;
    const hookErrors: (props: {
        expression: ts.Expression;
        replacer: ts.Expression;
    }) => ts.CallExpression;
    const getReturnTypeNode: (props: {
        context: ITypiaContext;
        declaration: ts.FunctionDeclaration;
        async: boolean;
    }) => ts.TypeNode | undefined;
}
