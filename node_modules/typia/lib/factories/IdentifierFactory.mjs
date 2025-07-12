import ts from 'typescript';
import { Escaper } from '../utils/Escaper.mjs';
import { TypeFactory } from './TypeFactory.mjs';

var IdentifierFactory;
(function (IdentifierFactory) {
    IdentifierFactory.identifier = (name) => Escaper.variable(name)
        ? ts.factory.createIdentifier(name)
        : ts.factory.createStringLiteral(name);
    IdentifierFactory.access = (input, key, chain) => {
        const postfix = IdentifierFactory.identifier(key);
        return ts.isStringLiteral(postfix)
            ? chain === true
                ? ts.factory.createElementAccessChain(input, ts.factory.createToken(ts.SyntaxKind.QuestionDotToken), postfix)
                : ts.factory.createElementAccessExpression(input, postfix)
            : chain === true
                ? ts.factory.createPropertyAccessChain(input, ts.factory.createToken(ts.SyntaxKind.QuestionDotToken), postfix)
                : ts.factory.createPropertyAccessExpression(input, postfix);
    };
    IdentifierFactory.getName = (input) => {
        const value = input.escapedText?.toString();
        if (typeof value === "string")
            return value;
        if (ts.isPropertyAccessExpression(input))
            return `${IdentifierFactory.getName(input.expression)}.${input.name.escapedText.toString()}`;
        else if (ts.isElementAccessExpression(input))
            return `${IdentifierFactory.getName(input.expression)}[${IdentifierFactory.getName(input.argumentExpression)}]`;
        return "unknown";
    };
    IdentifierFactory.postfix = (str) => Escaper.variable(str)
        ? `".${str}"`
        : `"[${JSON.stringify(str).split('"').join('\\"')}]"`;
    IdentifierFactory.parameter = (name, type, init) => {
        // instead of ts.version >= "4.8"
        if (ts.getDecorators !== undefined)
            return ts.factory.createParameterDeclaration(undefined, undefined, name, init?.kind === ts.SyntaxKind.QuestionToken
                ? ts.factory.createToken(ts.SyntaxKind.QuestionToken)
                : undefined, type ?? TypeFactory.keyword("any"), init && init.kind !== ts.SyntaxKind.QuestionToken ? init : undefined);
        // eslint-disable-next-line
        return ts.factory.createParameterDeclaration(undefined, undefined, undefined, name, init?.kind === ts.SyntaxKind.QuestionToken
            ? ts.factory.createToken(ts.SyntaxKind.QuestionToken)
            : undefined, type, init && init.kind !== ts.SyntaxKind.QuestionToken ? init : undefined);
    };
})(IdentifierFactory || (IdentifierFactory = {}));

export { IdentifierFactory };
//# sourceMappingURL=IdentifierFactory.mjs.map
