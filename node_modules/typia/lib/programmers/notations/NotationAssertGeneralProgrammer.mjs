import ts from 'typescript';
import { IdentifierFactory } from '../../factories/IdentifierFactory.mjs';
import { StatementFactory } from '../../factories/StatementFactory.mjs';
import { TypeFactory } from '../../factories/TypeFactory.mjs';
import { AssertProgrammer } from '../AssertProgrammer.mjs';
import { FeatureProgrammer } from '../FeatureProgrammer.mjs';
import { FunctionProgrammer } from '../helpers/FunctionProgrammer.mjs';
import { NotationGeneralProgrammer } from './NotationGeneralProgrammer.mjs';

var NotationAssertGeneralProgrammer;
(function (NotationAssertGeneralProgrammer) {
    NotationAssertGeneralProgrammer.decompose = (props) => {
        const assert = AssertProgrammer.decompose({
            ...props,
            config: {
                equals: false,
                guard: false,
            },
        });
        const notation = NotationGeneralProgrammer.decompose({
            ...props,
            validated: true,
        });
        return {
            functions: {
                ...assert.functions,
                ...notation.functions,
            },
            statements: [
                ...assert.statements,
                ...notation.statements,
                StatementFactory.constant({
                    name: "__assert",
                    value: assert.arrow,
                }),
                StatementFactory.constant({
                    name: "__notation",
                    value: notation.arrow,
                }),
            ],
            arrow: ts.factory.createArrowFunction(undefined, undefined, [
                IdentifierFactory.parameter("input", TypeFactory.keyword("any")),
                AssertProgrammer.Guardian.parameter({
                    context: props.context,
                    init: props.init,
                }),
            ], notation.arrow.type, undefined, ts.factory.createCallExpression(ts.factory.createIdentifier("__notation"), undefined, [
                ts.factory.createCallExpression(ts.factory.createIdentifier("__assert"), undefined, [
                    ts.factory.createIdentifier("input"),
                    AssertProgrammer.Guardian.identifier(),
                ]),
            ])),
        };
    };
    NotationAssertGeneralProgrammer.write = (props) => {
        const functor = new FunctionProgrammer(props.modulo.getText());
        const result = NotationAssertGeneralProgrammer.decompose({
            ...props,
            functor,
        });
        return FeatureProgrammer.writeDecomposed({
            modulo: props.modulo,
            functor,
            result,
        });
    };
})(NotationAssertGeneralProgrammer || (NotationAssertGeneralProgrammer = {}));

export { NotationAssertGeneralProgrammer };
//# sourceMappingURL=NotationAssertGeneralProgrammer.mjs.map
