import ts from 'typescript';
import { IdentifierFactory } from '../../factories/IdentifierFactory.mjs';
import { StatementFactory } from '../../factories/StatementFactory.mjs';
import { TypeFactory } from '../../factories/TypeFactory.mjs';
import { FeatureProgrammer } from '../FeatureProgrammer.mjs';
import { ValidateProgrammer } from '../ValidateProgrammer.mjs';
import { FunctionProgrammer } from '../helpers/FunctionProgrammer.mjs';

var JsonValidateParseProgrammer;
(function (JsonValidateParseProgrammer) {
    JsonValidateParseProgrammer.decompose = (props) => {
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
        return {
            functions: validate.functions,
            statements: [
                ...validate.statements,
                StatementFactory.constant({
                    name: "__validate",
                    value: validate.arrow,
                }),
            ],
            arrow: ts.factory.createArrowFunction(undefined, undefined, [IdentifierFactory.parameter("input", TypeFactory.keyword("string"))], props.context.importer.type({
                file: "typia",
                name: "IValidation",
                arguments: [
                    props.context.importer.type({
                        file: "typia",
                        name: "Primitive",
                        arguments: [
                            ts.factory.createTypeReferenceNode(props.name ??
                                TypeFactory.getFullName({
                                    checker: props.context.checker,
                                    type: props.type,
                                })),
                        ],
                    }),
                ],
            }), undefined, ts.factory.createAsExpression(ts.factory.createCallExpression(ts.factory.createIdentifier("__validate"), undefined, [
                ts.factory.createCallExpression(ts.factory.createIdentifier("JSON.parse"), undefined, [ts.factory.createIdentifier("input")]),
            ]), ts.factory.createTypeReferenceNode("any"))),
        };
    };
    JsonValidateParseProgrammer.write = (props) => {
        const functor = new FunctionProgrammer(props.modulo.getText());
        const result = JsonValidateParseProgrammer.decompose({
            context: props.context,
            modulo: props.modulo,
            functor,
            type: props.type,
            name: props.name,
        });
        return FeatureProgrammer.writeDecomposed({
            modulo: props.modulo,
            functor,
            result,
        });
    };
})(JsonValidateParseProgrammer || (JsonValidateParseProgrammer = {}));

export { JsonValidateParseProgrammer };
//# sourceMappingURL=JsonValidateParseProgrammer.mjs.map
