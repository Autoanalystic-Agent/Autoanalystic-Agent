import ts from 'typescript';
import { IdentifierFactory } from '../../factories/IdentifierFactory.mjs';
import { JsonMetadataFactory } from '../../factories/JsonMetadataFactory.mjs';
import { StatementFactory } from '../../factories/StatementFactory.mjs';
import { TypeFactory } from '../../factories/TypeFactory.mjs';
import { AssertProgrammer } from '../AssertProgrammer.mjs';
import { FeatureProgrammer } from '../FeatureProgrammer.mjs';
import { FunctionProgrammer } from '../helpers/FunctionProgrammer.mjs';

var JsonAssertParseProgrammer;
(function (JsonAssertParseProgrammer) {
    JsonAssertParseProgrammer.decompose = (props) => {
        JsonMetadataFactory.analyze({
            method: props.functor.method,
            checker: props.context.checker,
            transformer: props.context.transformer,
            type: props.type,
        });
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
        return {
            functions: assert.functions,
            statements: [
                ...assert.statements,
                StatementFactory.constant({
                    name: "__assert",
                    value: assert.arrow,
                }),
            ],
            arrow: ts.factory.createArrowFunction(undefined, undefined, [
                IdentifierFactory.parameter("input", TypeFactory.keyword("string")),
                AssertProgrammer.Guardian.parameter({
                    context: props.context,
                    init: props.init,
                }),
            ], props.context.importer.type({
                file: "typia",
                name: "Primitive",
                arguments: [
                    ts.factory.createTypeReferenceNode(props.name ??
                        TypeFactory.getFullName({
                            checker: props.context.checker,
                            type: props.type,
                        })),
                ],
            }), undefined, ts.factory.createAsExpression(ts.factory.createCallExpression(ts.factory.createIdentifier("__assert"), undefined, [
                ts.factory.createCallExpression(ts.factory.createIdentifier("JSON.parse"), undefined, [ts.factory.createIdentifier("input")]),
                AssertProgrammer.Guardian.identifier(),
            ]), TypeFactory.keyword("any"))),
        };
    };
    JsonAssertParseProgrammer.write = (props) => {
        const functor = new FunctionProgrammer(props.modulo.getText());
        const result = JsonAssertParseProgrammer.decompose({
            context: props.context,
            functor,
            type: props.type,
            name: props.name,
            init: props.init,
        });
        return FeatureProgrammer.writeDecomposed({
            modulo: props.modulo,
            functor,
            result,
        });
    };
})(JsonAssertParseProgrammer || (JsonAssertParseProgrammer = {}));

export { JsonAssertParseProgrammer };
//# sourceMappingURL=JsonAssertParseProgrammer.mjs.map
