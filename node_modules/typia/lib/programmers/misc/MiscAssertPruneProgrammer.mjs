import ts from 'typescript';
import { IdentifierFactory } from '../../factories/IdentifierFactory.mjs';
import { StatementFactory } from '../../factories/StatementFactory.mjs';
import { TypeFactory } from '../../factories/TypeFactory.mjs';
import { AssertProgrammer } from '../AssertProgrammer.mjs';
import { FeatureProgrammer } from '../FeatureProgrammer.mjs';
import { FunctionProgrammer } from '../helpers/FunctionProgrammer.mjs';
import { MiscPruneProgrammer } from './MiscPruneProgrammer.mjs';

var MiscAssertPruneProgrammer;
(function (MiscAssertPruneProgrammer) {
    MiscAssertPruneProgrammer.decompose = (props) => {
        const assert = AssertProgrammer.decompose({
            ...props,
            config: {
                equals: false,
                guard: false,
            },
        });
        const prune = MiscPruneProgrammer.decompose({
            ...props,
            validated: true,
        });
        return {
            functions: {
                ...assert.functions,
                ...prune.functions,
            },
            statements: [
                ...assert.statements,
                ...prune.statements,
                StatementFactory.constant({
                    name: "__assert",
                    value: assert.arrow,
                }),
                StatementFactory.constant({
                    name: "__prune",
                    value: prune.arrow,
                }),
            ],
            arrow: ts.factory.createArrowFunction(undefined, undefined, [
                IdentifierFactory.parameter("input", TypeFactory.keyword("any")),
                AssertProgrammer.Guardian.parameter({
                    context: props.context,
                    init: props.init,
                }),
            ], ts.factory.createTypeReferenceNode(props.name ??
                TypeFactory.getFullName({
                    checker: props.context.checker,
                    type: props.type,
                })), undefined, ts.factory.createBlock([
                ts.factory.createExpressionStatement(ts.factory.createBinaryExpression(ts.factory.createIdentifier("input"), ts.SyntaxKind.EqualsToken, ts.factory.createCallExpression(ts.factory.createIdentifier("__assert"), undefined, [
                    ts.factory.createIdentifier("input"),
                    AssertProgrammer.Guardian.identifier(),
                ]))),
                ts.factory.createExpressionStatement(ts.factory.createCallExpression(ts.factory.createIdentifier("__prune"), undefined, [ts.factory.createIdentifier("input")])),
                ts.factory.createReturnStatement(ts.factory.createIdentifier("input")),
            ], true)),
        };
    };
    MiscAssertPruneProgrammer.write = (props) => {
        const functor = new FunctionProgrammer(props.modulo.getText());
        const result = MiscAssertPruneProgrammer.decompose({
            ...props,
            functor,
        });
        return FeatureProgrammer.writeDecomposed({
            modulo: props.modulo,
            functor,
            result,
        });
    };
})(MiscAssertPruneProgrammer || (MiscAssertPruneProgrammer = {}));

export { MiscAssertPruneProgrammer };
//# sourceMappingURL=MiscAssertPruneProgrammer.mjs.map
