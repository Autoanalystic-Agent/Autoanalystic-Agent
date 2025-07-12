import ts from 'typescript';
import { IdentifierFactory } from '../../factories/IdentifierFactory.mjs';
import { StatementFactory } from '../../factories/StatementFactory.mjs';
import { TypeFactory } from '../../factories/TypeFactory.mjs';
import { FeatureProgrammer } from '../FeatureProgrammer.mjs';
import { IsProgrammer } from '../IsProgrammer.mjs';
import { FunctionProgrammer } from '../helpers/FunctionProgrammer.mjs';
import { MiscCloneProgrammer } from './MiscCloneProgrammer.mjs';

var MiscIsCloneProgrammer;
(function (MiscIsCloneProgrammer) {
    MiscIsCloneProgrammer.decompose = (props) => {
        const is = IsProgrammer.decompose({
            ...props,
            config: {
                equals: false,
            },
        });
        const clone = MiscCloneProgrammer.decompose({
            ...props,
            validated: true,
        });
        return {
            functions: {
                ...is.functions,
                ...clone.functions,
            },
            statements: [
                ...is.statements,
                ...clone.statements,
                StatementFactory.constant({
                    name: "__is",
                    value: is.arrow,
                }),
                StatementFactory.constant({
                    name: "__clone",
                    value: clone.arrow,
                }),
            ],
            arrow: ts.factory.createArrowFunction(undefined, undefined, [IdentifierFactory.parameter("input", TypeFactory.keyword("any"))], ts.factory.createUnionTypeNode([
                clone.arrow.type ?? TypeFactory.keyword("any"),
                ts.factory.createTypeReferenceNode("null"),
            ]), undefined, ts.factory.createBlock([
                ts.factory.createIfStatement(ts.factory.createPrefixUnaryExpression(ts.SyntaxKind.ExclamationToken, ts.factory.createCallExpression(ts.factory.createIdentifier("__is"), undefined, [ts.factory.createIdentifier("input")])), ts.factory.createReturnStatement(ts.factory.createNull())),
                ts.factory.createReturnStatement(ts.factory.createCallExpression(ts.factory.createIdentifier("__clone"), undefined, [ts.factory.createIdentifier("input")])),
            ], true)),
        };
    };
    MiscIsCloneProgrammer.write = (props) => {
        const functor = new FunctionProgrammer(props.modulo.getText());
        const result = MiscIsCloneProgrammer.decompose({
            ...props,
            functor,
        });
        return FeatureProgrammer.writeDecomposed({
            modulo: props.modulo,
            functor,
            result,
        });
    };
})(MiscIsCloneProgrammer || (MiscIsCloneProgrammer = {}));

export { MiscIsCloneProgrammer };
//# sourceMappingURL=MiscIsCloneProgrammer.mjs.map
