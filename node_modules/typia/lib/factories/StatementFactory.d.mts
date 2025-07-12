import ts from "typescript";
export declare namespace StatementFactory {
    const mut: (props: {
        name: string;
        type?: ts.TypeNode | undefined;
        initializer?: ts.Expression | undefined;
    }) => ts.VariableStatement;
    const constant: (props: {
        name: string;
        type?: ts.TypeNode | undefined;
        value?: ts.Expression | undefined;
    }) => ts.VariableStatement;
    const entry: (props: {
        key: string;
        value: string;
    }) => ts.VariableDeclarationList;
    const transpile: (script: string) => ts.ExpressionStatement;
    const block: (expression: ts.Expression) => ts.Block;
}
