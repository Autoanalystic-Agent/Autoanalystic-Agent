import ts from "typescript";
import { ITypiaContext } from "../../transformers/ITypiaContext";
export declare namespace FunctionalAssertFunctionProgrammer {
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
    const errorFactoryWrapper: (props: {
        context: ITypiaContext;
        parameters: readonly ts.ParameterDeclaration[];
        init: ts.Expression | undefined;
    }) => {
        name: string;
        variable: ts.VariableStatement;
    };
    const hookPath: (props: {
        wrapper: string;
        replacer: string;
    }) => ts.ArrowFunction;
}
