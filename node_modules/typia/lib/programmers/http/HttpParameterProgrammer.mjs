import ts from 'typescript';
import { IdentifierFactory } from '../../factories/IdentifierFactory.mjs';
import { MetadataCollection } from '../../factories/MetadataCollection.mjs';
import { MetadataFactory } from '../../factories/MetadataFactory.mjs';
import { StatementFactory } from '../../factories/StatementFactory.mjs';
import { TypeFactory } from '../../factories/TypeFactory.mjs';
import { TransformerError } from '../../transformers/TransformerError.mjs';
import { StringUtil } from '../../utils/StringUtil.mjs';
import { AssertProgrammer } from '../AssertProgrammer.mjs';
import { HttpMetadataUtil } from '../helpers/HttpMetadataUtil.mjs';

var HttpParameterProgrammer;
(function (HttpParameterProgrammer) {
    HttpParameterProgrammer.write = (props) => {
        const result = MetadataFactory.analyze({
            checker: props.context.checker,
            transformer: props.context.transformer,
            options: {
                escape: false,
                constant: true,
                absorb: true,
                validate: HttpParameterProgrammer.validate,
            },
            collection: new MetadataCollection(),
            type: props.type,
        });
        if (result.success === false)
            throw TransformerError.from({
                code: props.modulo.getText(),
                errors: result.errors,
            });
        const atomic = [...HttpMetadataUtil.atomics(result.data)][0];
        const block = [
            StatementFactory.constant({
                name: "assert",
                value: AssertProgrammer.write({
                    ...props,
                    context: {
                        ...props.context,
                        options: {
                            numeric: true,
                        },
                    },
                    config: {
                        equals: false,
                        guard: false,
                    },
                }),
            }),
            StatementFactory.constant({
                name: "value",
                value: ts.factory.createCallExpression(props.context.importer.internal(`httpParameterRead${StringUtil.capitalize(atomic)}`), undefined, [ts.factory.createIdentifier("input")]),
            }),
            ts.factory.createReturnStatement(ts.factory.createCallExpression(ts.factory.createIdentifier("assert"), undefined, [ts.factory.createIdentifier("value")])),
        ];
        return ts.factory.createArrowFunction(undefined, undefined, [
            IdentifierFactory.parameter("input", ts.factory.createTypeReferenceNode("string")),
        ], ts.factory.createTypeReferenceNode(props.name ??
            TypeFactory.getFullName({
                checker: props.context.checker,
                type: props.type,
            })), undefined, ts.factory.createBlock(block, true));
    };
    HttpParameterProgrammer.validate = (meta) => {
        const errors = [];
        const insert = (msg) => errors.push(msg);
        if (meta.any)
            insert("do not allow any type");
        if (meta.isRequired() === false)
            insert("do not allow undefindable type");
        const atomics = HttpMetadataUtil.atomics(meta);
        const expected = meta.atomics.length +
            meta.templates.length +
            meta.constants.map((c) => c.values.length).reduce((a, b) => a + b, 0);
        if (meta.size() !== expected || atomics.size === 0)
            insert("only atomic or constant types are allowed");
        if (atomics.size > 1)
            insert("do not allow union type");
        return errors;
    };
})(HttpParameterProgrammer || (HttpParameterProgrammer = {}));

export { HttpParameterProgrammer };
//# sourceMappingURL=HttpParameterProgrammer.mjs.map
