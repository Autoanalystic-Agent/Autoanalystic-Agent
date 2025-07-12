import ts from 'typescript';
import { IdentifierFactory } from '../../factories/IdentifierFactory.mjs';
import { StatementFactory } from '../../factories/StatementFactory.mjs';
import { TypeFactory } from '../../factories/TypeFactory.mjs';
import { AssertProgrammer } from '../AssertProgrammer.mjs';
import { FeatureProgrammer } from '../FeatureProgrammer.mjs';
import { FunctionProgrammer } from '../helpers/FunctionProgrammer.mjs';
import { HttpFormDataProgrammer } from './HttpFormDataProgrammer.mjs';

var HttpAssertFormDataProgrammer;
(function (HttpAssertFormDataProgrammer) {
    HttpAssertFormDataProgrammer.decompose = (props) => {
        const assert = AssertProgrammer.decompose({
            ...props,
            context: {
                ...props.context,
                options: {
                    ...props.context.options,
                    functional: false,
                    numeric: true,
                },
            },
            config: {
                equals: false,
                guard: false,
            },
        });
        const decode = HttpFormDataProgrammer.decompose(props);
        return {
            functions: {
                ...assert.functions,
                ...decode.functions,
            },
            statements: [
                ...assert.statements,
                ...decode.statements,
                StatementFactory.constant({
                    name: "__assert",
                    value: assert.arrow,
                }),
                StatementFactory.constant({
                    name: "__decode",
                    value: decode.arrow,
                }),
            ],
            arrow: ts.factory.createArrowFunction(undefined, undefined, [
                IdentifierFactory.parameter("input", TypeFactory.keyword("any")),
                AssertProgrammer.Guardian.parameter({
                    context: props.context,
                    init: props.init,
                }),
            ], decode.arrow.type, undefined, ts.factory.createCallExpression(ts.factory.createIdentifier("__assert"), undefined, [
                ts.factory.createCallExpression(ts.factory.createIdentifier("__decode"), undefined, [ts.factory.createIdentifier("input")]),
                AssertProgrammer.Guardian.identifier(),
            ])),
        };
    };
    HttpAssertFormDataProgrammer.write = (props) => {
        const functor = new FunctionProgrammer(props.modulo.getText());
        const result = HttpAssertFormDataProgrammer.decompose({
            ...props,
            functor,
        });
        return FeatureProgrammer.writeDecomposed({
            modulo: props.modulo,
            functor,
            result,
        });
    };
})(HttpAssertFormDataProgrammer || (HttpAssertFormDataProgrammer = {}));

export { HttpAssertFormDataProgrammer };
//# sourceMappingURL=HttpAssertFormDataProgrammer.mjs.map
