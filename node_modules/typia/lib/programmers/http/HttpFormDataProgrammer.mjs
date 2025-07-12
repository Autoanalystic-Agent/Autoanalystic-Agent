import ts from 'typescript';
import { IdentifierFactory } from '../../factories/IdentifierFactory.mjs';
import { MetadataCollection } from '../../factories/MetadataCollection.mjs';
import { MetadataFactory } from '../../factories/MetadataFactory.mjs';
import { StatementFactory } from '../../factories/StatementFactory.mjs';
import { TypeFactory } from '../../factories/TypeFactory.mjs';
import { MetadataArrayType } from '../../schemas/metadata/MetadataArrayType.mjs';
import { TransformerError } from '../../transformers/TransformerError.mjs';
import { Escaper } from '../../utils/Escaper.mjs';
import { StringUtil } from '../../utils/StringUtil.mjs';
import { FeatureProgrammer } from '../FeatureProgrammer.mjs';
import { FunctionProgrammer } from '../helpers/FunctionProgrammer.mjs';
import { HttpMetadataUtil } from '../helpers/HttpMetadataUtil.mjs';

var HttpFormDataProgrammer;
(function (HttpFormDataProgrammer) {
    HttpFormDataProgrammer.decompose = (props) => {
        // ANALYZE TYPE
        const collection = new MetadataCollection();
        const result = MetadataFactory.analyze({
            checker: props.context.checker,
            transformer: props.context.transformer,
            options: {
                escape: false,
                constant: true,
                absorb: true,
                validate: HttpFormDataProgrammer.validate,
            },
            collection,
            type: props.type,
        });
        if (result.success === false)
            throw TransformerError.from({
                code: props.functor.method,
                errors: result.errors,
            });
        // DO TRANSFORM
        const object = result.data.objects[0].type;
        const statements = decode_object({
            context: props.context,
            object,
        });
        return {
            functions: {},
            statements: [],
            arrow: ts.factory.createArrowFunction(undefined, undefined, [
                IdentifierFactory.parameter("input", ts.factory.createTypeReferenceNode("FormData")),
            ], props.context.importer.type({
                file: "typia",
                name: "Resolved",
                arguments: [
                    ts.factory.createTypeReferenceNode(props.name ??
                        TypeFactory.getFullName({
                            checker: props.context.checker,
                            type: props.type,
                        })),
                ],
            }), undefined, ts.factory.createBlock(statements, true)),
        };
    };
    HttpFormDataProgrammer.write = (props) => {
        const functor = new FunctionProgrammer(props.modulo.getText());
        const result = HttpFormDataProgrammer.decompose({
            ...props,
            functor,
        });
        return FeatureProgrammer.writeDecomposed({
            modulo: props.modulo,
            functor,
            result,
        });
    };
    HttpFormDataProgrammer.validate = (meta, explore) => {
        const errors = [];
        const insert = (msg) => errors.push(msg);
        if (explore.top === true) {
            // TOP MUST BE ONLY OBJECT
            if (meta.objects.length !== 1 || meta.bucket() !== 1)
                insert("only one object type is allowed.");
            if (meta.nullable === true)
                insert("formdata parameters cannot be null.");
            if (meta.isRequired() === false)
                insert("formdata parameters cannot be undefined.");
        }
        else if (explore.nested !== null &&
            explore.nested instanceof MetadataArrayType) {
            //----
            // ARRAY
            //----
            const atomics = HttpMetadataUtil.atomics(meta);
            const expected = meta.atomics.length +
                meta.templates.length +
                meta.constants.map((c) => c.values.length).reduce((a, b) => a + b, 0) +
                meta.natives.filter((native) => native.name === "Blob" || native.name === "File").length;
            if (atomics.size > 1)
                insert("union type is not allowed in array.");
            if (meta.size() !== expected)
                insert("only atomic, constant or blob (file) types are allowed in array.");
        }
        else if (explore.object && explore.property !== null) {
            //----
            // COMMON
            //----
            // PROPERTY MUST BE SOLE
            if (typeof explore.property === "object")
                insert("dynamic property is not allowed.");
            // DO NOT ALLOW TUPLE TYPE
            if (meta.tuples.length)
                insert("tuple type is not allowed.");
            // DO NOT ALLOW UNION TYPE
            if (HttpMetadataUtil.isUnion(meta))
                insert("union type is not allowed.");
            // DO NOT ALLOW NESTED OBJECT
            if (meta.objects.length ||
                meta.sets.length ||
                meta.maps.length ||
                meta.natives.filter((native) => native.name !== "Blob" && native.name !== "File").length)
                insert("nested object type is not allowed.");
        }
        return errors;
    };
    const decode_object = (props) => {
        // const input: ts.Identifier = ts.factory.createIdentifier("input");
        const output = ts.factory.createIdentifier("output");
        return [
            StatementFactory.constant({
                name: "output",
                value: ts.factory.createObjectLiteralExpression(props.object.properties.map((p) => decode_regular_property({
                    context: props.context,
                    property: p,
                })), true),
            }),
            ts.factory.createReturnStatement(ts.factory.createAsExpression(output, TypeFactory.keyword("any"))),
        ];
    };
    const decode_regular_property = (props) => {
        const key = props.property.key.constants[0].values[0]
            .value;
        const value = props.property.value;
        const [type, isArray] = value
            .atomics.length
            ? [value.atomics[0].type, false]
            : value.constants.length
                ? [value.constants[0].type, false]
                : value.templates.length
                    ? ["string", false]
                    : value.natives.some((native) => native.name === "Blob")
                        ? ["blob", false]
                        : value.natives.some((native) => native.name === "File")
                            ? ["file", false]
                            : (() => {
                                const meta = value.arrays[0]?.type.value ??
                                    value.tuples[0].type.elements[0];
                                return meta.atomics.length
                                    ? [meta.atomics[0].type, true]
                                    : meta.templates.length
                                        ? ["string", true]
                                        : meta.natives.some((native) => native.name === "Blob")
                                            ? ["blob", true]
                                            : meta.natives.some((native) => native.name === "File")
                                                ? ["file", true]
                                                : [meta.constants[0].type, true];
                            })();
        return ts.factory.createPropertyAssignment(Escaper.variable(key) ? key : ts.factory.createStringLiteral(key), isArray
            ? decode_array({
                context: props.context,
                metadata: value,
                input: ts.factory.createCallExpression(IdentifierFactory.access(ts.factory.createCallExpression(ts.factory.createIdentifier("input.getAll"), undefined, [ts.factory.createStringLiteral(key)]), "map"), undefined, [
                    ts.factory.createArrowFunction(undefined, undefined, [IdentifierFactory.parameter("elem")], undefined, undefined, decode_value({
                        context: props.context,
                        type,
                        coalesce: false,
                        input: ts.factory.createIdentifier("elem"),
                    })),
                ]),
            })
            : decode_value({
                context: props.context,
                type,
                coalesce: value.nullable === false && value.isRequired() === false,
                input: ts.factory.createCallExpression(ts.factory.createIdentifier("input.get"), undefined, [ts.factory.createStringLiteral(key)]),
            }));
    };
    const decode_value = (props) => {
        const call = ts.factory.createCallExpression(props.context.importer.internal(`httpFormDataRead${StringUtil.capitalize(props.type)}`), undefined, [props.input]);
        return props.coalesce
            ? ts.factory.createBinaryExpression(call, ts.factory.createToken(ts.SyntaxKind.QuestionQuestionToken), ts.factory.createIdentifier("undefined"))
            : call;
    };
    const decode_array = (props) => props.metadata.nullable || props.metadata.isRequired() === false
        ? ts.factory.createCallExpression(props.context.importer.internal("httpFormDataReadArray"), undefined, [
            props.input,
            props.metadata.nullable
                ? ts.factory.createNull()
                : ts.factory.createIdentifier("undefined"),
        ])
        : props.input;
})(HttpFormDataProgrammer || (HttpFormDataProgrammer = {}));

export { HttpFormDataProgrammer };
//# sourceMappingURL=HttpFormDataProgrammer.mjs.map
