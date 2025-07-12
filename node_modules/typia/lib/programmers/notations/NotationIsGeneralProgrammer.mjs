import ts from 'typescript';
import { IdentifierFactory } from '../../factories/IdentifierFactory.mjs';
import { StatementFactory } from '../../factories/StatementFactory.mjs';
import { TypeFactory } from '../../factories/TypeFactory.mjs';
import { FeatureProgrammer } from '../FeatureProgrammer.mjs';
import { IsProgrammer } from '../IsProgrammer.mjs';
import { FunctionProgrammer } from '../helpers/FunctionProgrammer.mjs';
import { NotationGeneralProgrammer } from './NotationGeneralProgrammer.mjs';

var NotationIsGeneralProgrammer;
(function (NotationIsGeneralProgrammer) {
    NotationIsGeneralProgrammer.decompose = (props) => {
        const is = IsProgrammer.decompose({
            ...props,
            config: {
                equals: false,
            },
        });
        const notation = NotationGeneralProgrammer.decompose({
            ...props,
            validated: true,
        });
        return {
            functions: {
                ...is.functions,
                ...notation.functions,
            },
            statements: [
                ...is.statements,
                ...notation.statements,
                StatementFactory.constant({
                    name: "__is",
                    value: is.arrow,
                }),
                StatementFactory.constant({
                    name: "__notation",
                    value: notation.arrow,
                }),
            ],
            arrow: ts.factory.createArrowFunction(undefined, undefined, [IdentifierFactory.parameter("input", TypeFactory.keyword("any"))], ts.factory.createUnionTypeNode([
                notation.arrow.type ?? TypeFactory.keyword("any"),
                ts.factory.createTypeReferenceNode("null"),
            ]), undefined, ts.factory.createBlock([
                ts.factory.createIfStatement(ts.factory.createPrefixUnaryExpression(ts.SyntaxKind.ExclamationToken, ts.factory.createCallExpression(ts.factory.createIdentifier("__is"), undefined, [ts.factory.createIdentifier("input")])), ts.factory.createReturnStatement(ts.factory.createNull())),
                ts.factory.createReturnStatement(ts.factory.createCallExpression(ts.factory.createIdentifier("__notation"), undefined, [ts.factory.createIdentifier("input")])),
            ], true)),
        };
    };
    NotationIsGeneralProgrammer.write = (props) => {
        const functor = new FunctionProgrammer(props.modulo.getText());
        const result = NotationIsGeneralProgrammer.decompose({
            ...props,
            functor,
        });
        return FeatureProgrammer.writeDecomposed({
            modulo: props.modulo,
            functor,
            result,
        });
    };
})(NotationIsGeneralProgrammer || (NotationIsGeneralProgrammer = {}));

export { NotationIsGeneralProgrammer };
//# sourceMappingURL=NotationIsGeneralProgrammer.mjs.map
