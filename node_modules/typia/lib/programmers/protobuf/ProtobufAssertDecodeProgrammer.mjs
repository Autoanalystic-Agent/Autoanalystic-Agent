import ts from 'typescript';
import { StatementFactory } from '../../factories/StatementFactory.mjs';
import { AssertProgrammer } from '../AssertProgrammer.mjs';
import { FeatureProgrammer } from '../FeatureProgrammer.mjs';
import { FunctionProgrammer } from '../helpers/FunctionProgrammer.mjs';
import { ProtobufDecodeProgrammer } from './ProtobufDecodeProgrammer.mjs';

var ProtobufAssertDecodeProgrammer;
(function (ProtobufAssertDecodeProgrammer) {
    ProtobufAssertDecodeProgrammer.decompose = (props) => {
        const assert = AssertProgrammer.decompose({
            ...props,
            context: {
                ...props.context,
                options: {
                    ...props.context.options,
                    functional: false,
                    numeric: false,
                },
            },
            config: {
                equals: false,
                guard: false,
            },
        });
        const decode = ProtobufDecodeProgrammer.decompose(props);
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
                ...decode.arrow.parameters,
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
    ProtobufAssertDecodeProgrammer.write = (props) => {
        const functor = new FunctionProgrammer(props.modulo.getText());
        const result = ProtobufAssertDecodeProgrammer.decompose({
            ...props,
            functor,
        });
        return FeatureProgrammer.writeDecomposed({
            modulo: props.modulo,
            functor,
            result,
        });
    };
})(ProtobufAssertDecodeProgrammer || (ProtobufAssertDecodeProgrammer = {}));

export { ProtobufAssertDecodeProgrammer };
//# sourceMappingURL=ProtobufAssertDecodeProgrammer.mjs.map
