import ts from 'typescript';
import { StatementFactory } from '../../factories/StatementFactory.mjs';
import { TypeFactory } from '../../factories/TypeFactory.mjs';
import { FeatureProgrammer } from '../FeatureProgrammer.mjs';
import { ValidateProgrammer } from '../ValidateProgrammer.mjs';
import { FunctionProgrammer } from '../helpers/FunctionProgrammer.mjs';
import { ProtobufDecodeProgrammer } from './ProtobufDecodeProgrammer.mjs';

var ProtobufValidateDecodeProgrammer;
(function (ProtobufValidateDecodeProgrammer) {
    ProtobufValidateDecodeProgrammer.decompose = (props) => {
        const validate = ValidateProgrammer.decompose({
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
            },
        });
        const decode = ProtobufDecodeProgrammer.decompose(props);
        return {
            functions: {
                ...validate.functions,
                ...decode.functions,
            },
            statements: [
                ...validate.statements,
                StatementFactory.constant({
                    name: "__validate",
                    value: validate.arrow,
                }),
                StatementFactory.constant({
                    name: "__decode",
                    value: decode.arrow,
                }),
            ],
            arrow: ts.factory.createArrowFunction(undefined, undefined, decode.arrow.parameters, props.context.importer.type({
                file: "typia",
                name: "IValidation",
                arguments: [decode.arrow.type ?? TypeFactory.keyword("any")],
            }), undefined, ts.factory.createCallExpression(ts.factory.createIdentifier("__validate"), undefined, [
                ts.factory.createCallExpression(ts.factory.createIdentifier("__decode"), undefined, [ts.factory.createIdentifier("input")]),
            ])),
        };
    };
    ProtobufValidateDecodeProgrammer.write = (props) => {
        const functor = new FunctionProgrammer(props.modulo.getText());
        const result = ProtobufValidateDecodeProgrammer.decompose({
            ...props,
            functor,
        });
        return FeatureProgrammer.writeDecomposed({
            modulo: props.modulo,
            functor,
            result,
        });
    };
})(ProtobufValidateDecodeProgrammer || (ProtobufValidateDecodeProgrammer = {}));

export { ProtobufValidateDecodeProgrammer };
//# sourceMappingURL=ProtobufValidateDecodeProgrammer.mjs.map
