import ts from "typescript";
export declare namespace IdentifierFactory {
    const identifier: (name: string) => ts.Identifier | ts.StringLiteral;
    const access: (input: ts.Expression, key: string, chain?: boolean) => ts.PropertyAccessExpression | ts.ElementAccessExpression;
    const getName: (input: ts.Expression) => string;
    const postfix: (str: string) => string;
    const parameter: (name: string | ts.BindingName, type?: ts.TypeNode | undefined, init?: ts.Expression | ts.PunctuationToken<ts.SyntaxKind.QuestionToken> | undefined) => ts.ParameterDeclaration;
}
