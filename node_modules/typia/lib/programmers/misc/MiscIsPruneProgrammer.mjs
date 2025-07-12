import ts from 'typescript';
import { IdentifierFactory } from '../../factories/IdentifierFactory.mjs';
import { StatementFactory } from '../../factories/StatementFactory.mjs';
import { TypeFactory } from '../../factories/TypeFactory.mjs';
import { FeatureProgrammer } from '../FeatureProgrammer.mjs';
import { IsProgrammer } from '../IsProgrammer.mjs';
import { FunctionProgrammer } from '../helpers/FunctionProgrammer.mjs';
import { MiscPruneProgrammer } from './MiscPruneProgrammer.mjs';

var MiscIsPruneProgrammer;
(function (MiscIsPruneProgrammer) {
    MiscIsPruneProgrammer.decompose = (props) => {
        const is = IsProgrammer.decompose({
            ...props,
            config: {
                equals: false,
            },
        });
        const prune = MiscPruneProgrammer.decompose({
            ...props,
            validated: true,
        });
        return {
            functions: {
                ...is.functions,
                ...prune.functions,
            },
            statements: [
                ...is.statements,
                ...prune.statements,
                StatementFactory.constant({
                    name: "__is",
                    value: is.arrow,
                }),
                StatementFactory.constant({
                    name: "__prune",
                    value: prune.arrow,
                }),
            ],
            arrow: ts.factory.createArrowFunction(undefined, undefined, [IdentifierFactory.parameter("input", TypeFactory.keyword("any"))], is.arrow.type, undefined, ts.factory.createBlock([
                ts.factory.createIfStatement(ts.factory.createEquality(ts.factory.createFalse(), ts.factory.createCallExpression(ts.factory.createIdentifier("__is"), undefined, [ts.factory.createIdentifier("input")])), ts.factory.createReturnStatement(ts.factory.createFalse())),
                ts.factory.createExpressionStatement(ts.factory.createCallExpression(ts.factory.createIdentifier("__prune"), undefined, [ts.factory.createIdentifier("input")])),
                ts.factory.createReturnStatement(ts.factory.createTrue()),
            ], true)),
        };
    };
    MiscIsPruneProgrammer.write = (props) => {
        const functor = new FunctionProgrammer(props.modulo.getText());
        const result = MiscIsPruneProgrammer.decompose({
            ...props,
            functor,
        });
        return FeatureProgrammer.writeDecomposed({
            modulo: props.modulo,
            functor,
            result,
        });
    };
})(MiscIsPruneProgrammer || (MiscIsPruneProgrammer = {}));

export { MiscIsPruneProgrammer };
//# sourceMappingURL=MiscIsPruneProgrammer.mjs.map
