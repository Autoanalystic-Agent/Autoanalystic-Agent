import ts from 'typescript';
import { ExpressionFactory } from '../../factories/ExpressionFactory.mjs';
import { IdentifierFactory } from '../../factories/IdentifierFactory.mjs';
import { MetadataCollection } from '../../factories/MetadataCollection.mjs';
import { MetadataFactory } from '../../factories/MetadataFactory.mjs';
import { StatementFactory } from '../../factories/StatementFactory.mjs';
import { TypeFactory } from '../../factories/TypeFactory.mjs';
import { MetadataArrayType } from '../../schemas/metadata/MetadataArrayType.mjs';
import { TransformerError } from '../../transformers/TransformerError.mjs';
import { Escaper } from '../../utils/Escaper.mjs';
import { MapUtil } from '../../utils/MapUtil.mjs';
import { StringUtil } from '../../utils/StringUtil.mjs';
import { FeatureProgrammer } from '../FeatureProgrammer.mjs';
import { FunctionProgrammer } from '../helpers/FunctionProgrammer.mjs';
import { HttpMetadataUtil } from '../helpers/HttpMetadataUtil.mjs';

var HttpHeadersProgrammer;
(function (HttpHeadersProgrammer) {
    HttpHeadersProgrammer.INPUT_TYPE = "Record<string, string | string[] | undefined>";
    HttpHeadersProgrammer.decompose = (props) => {
        // ANALYZE TYPE
        const collection = new MetadataCollection();
        const result = MetadataFactory.analyze({
            checker: props.context.checker,
            transformer: props.context.transformer,
            options: {
                escape: false,
                constant: true,
                absorb: true,
                validate: HttpHeadersProgrammer.validate,
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
                IdentifierFactory.parameter("input", ts.factory.createTypeReferenceNode(HttpHeadersProgrammer.INPUT_TYPE)),
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
    HttpHeadersProgrammer.write = (props) => {
        const functor = new FunctionProgrammer(props.modulo.getText());
        const result = HttpHeadersProgrammer.decompose({
            ...props,
            functor,
        });
        return FeatureProgrammer.writeDecomposed({
            modulo: props.modulo,
            functor,
            result,
        });
    };
    HttpHeadersProgrammer.validate = (metadata, explore) => {
        const errors = [];
        const insert = (msg) => errors.push(msg);
        if (explore.top === true) {
            // TOP MUST BE ONLY OBJECT
            if (metadata.objects.length !== 1 || metadata.bucket() !== 1)
                insert("only one object type is allowed.");
            if (metadata.nullable === true)
                insert("headers cannot be null.");
            if (metadata.isRequired() === false)
                insert("headers cannot be null.");
        }
        else if (explore.nested !== null &&
            explore.nested instanceof MetadataArrayType) {
            //----
            // ARRAY
            //----
            const atomics = HttpMetadataUtil.atomics(metadata);
            const expected = metadata.atomics.length +
                metadata.templates.length +
                metadata.constants
                    .map((c) => c.values.length)
                    .reduce((a, b) => a + b, 0);
            if (atomics.size > 1)
                insert("union type is not allowed in array.");
            if (metadata.size() !== expected)
                insert("only atomic or constant types are allowed in array.");
            if (metadata.nullable === true)
                insert("nullable type is not allowed in array.");
            if (metadata.isRequired() === false)
                insert("optional type is not allowed in array.");
        }
        else if (explore.object && explore.property !== null) {
            //----
            // COMMON
            //----
            // PROPERTY MUST BE SOLE
            if (typeof explore.property === "object")
                insert("dynamic property is not allowed.");
            // DO NOT ALLOW TUPLE TYPE
            if (metadata.tuples.length)
                insert("tuple type is not allowed.");
            // DO NOT ALLOW UNION TYPE
            if (HttpMetadataUtil.isUnion(metadata))
                insert("union type is not allowed.");
            // DO NOT ALLOW NESTED OBJECT
            if (metadata.objects.length ||
                metadata.sets.length ||
                metadata.maps.length ||
                metadata.natives.length)
                insert("nested object type is not allowed.");
            // DO NOT ALLOW NULLABLE
            if (metadata.nullable === true)
                insert("nullable type is not allowed.");
            //----
            // SPECIAL KEY NAMES
            //----
            const isArray = metadata.arrays.length >= 1 || metadata.tuples.length >= 1;
            // SET-COOKIE MUST BE ARRAY
            if (typeof explore.property === "string" &&
                explore.property.toLowerCase() === "set-cookie" &&
                isArray === false)
                insert(`${explore.property} property must be array.`);
            // MUST BE SINGULAR CASE
            if (typeof explore.property === "string" &&
                SINGULAR.has(explore.property.toLowerCase()) &&
                isArray === true)
                insert("property cannot be array.");
        }
        else if (explore.object && explore.property === null) {
            const counter = new Map();
            for (const prop of explore.object.properties) {
                const key = prop.key.getSoleLiteral();
                if (key === null)
                    continue;
                MapUtil.take(counter, key.toLowerCase(), () => new Set()).add(key);
            }
            for (const [key, set] of counter)
                if (set.size > 1)
                    insert(`duplicated keys when converting to lowercase letters: [${[
                        ...set,
                    ].join(", ")}] -> ${key}`);
        }
        return errors;
    };
    const decode_object = (props) => {
        const output = ts.factory.createIdentifier("output");
        const optionals = [];
        return [
            StatementFactory.constant({
                name: "output",
                value: ts.factory.createObjectLiteralExpression(props.object.properties.map((p) => {
                    if (!p.value.isRequired() &&
                        p.value.arrays.length + p.value.tuples.length > 0)
                        optionals.push(p.key.constants[0].values[0].value);
                    return decode_regular_property({
                        context: props.context,
                        property: p,
                    });
                }), true),
            }),
            ...optionals.map((key) => {
                const access = IdentifierFactory.access(output, key);
                return ts.factory.createIfStatement(ts.factory.createStrictEquality(ExpressionFactory.number(0), IdentifierFactory.access(access, "length")), ts.factory.createExpressionStatement(ts.factory.createDeleteExpression(access)));
            }),
            ts.factory.createReturnStatement(ts.factory.createAsExpression(output, TypeFactory.keyword("any"))),
        ];
    };
    const decode_regular_property = (props) => {
        const key = props.property.key.constants[0].values[0]
            .value;
        const value = props.property.value;
        const [type, isArray] = value.atomics.length
            ? [value.atomics[0].type, false]
            : value.constants.length
                ? [value.constants[0].type, false]
                : value.templates.length
                    ? ["string", false]
                    : (() => {
                        const meta = value.arrays[0]?.type.value ??
                            value.tuples[0].type.elements[0];
                        return meta.atomics.length
                            ? [meta.atomics[0].type, true]
                            : meta.templates.length
                                ? ["string", true]
                                : [meta.constants[0].type, true];
                    })();
        const input = IdentifierFactory.access(ts.factory.createIdentifier("input"), key.toLowerCase());
        return ts.factory.createPropertyAssignment(Escaper.variable(key) ? key : ts.factory.createStringLiteral(key), isArray
            ? key === "set-cookie"
                ? input
                : decode_array({
                    context: props.context,
                    type,
                    key,
                    value,
                    input,
                })
            : decode_value({
                context: props.context,
                type,
                input,
            }));
    };
    const decode_value = (props) => props.type === "string"
        ? props.input
        : ts.factory.createCallExpression(props.context.importer.internal(`httpHeaderRead${StringUtil.capitalize(props.type)}`), undefined, [props.input]);
    const decode_array = (props) => {
        const reader = props.type === "string"
            ? ts.factory.createArrowFunction(undefined, undefined, [IdentifierFactory.parameter("str")], undefined, undefined, ts.factory.createCallExpression(IdentifierFactory.access(ts.factory.createIdentifier("str"), "trim"), undefined, undefined))
            : props.context.importer.internal(`httpHeaderRead${StringUtil.capitalize(props.type)}`);
        const split = ts.factory.createCallChain(ts.factory.createPropertyAccessChain(ts.factory.createCallChain(ts.factory.createPropertyAccessChain(props.input, ts.factory.createToken(ts.SyntaxKind.QuestionDotToken), ts.factory.createIdentifier("split")), undefined, undefined, [
            ts.factory.createStringLiteral(props.key === "cookie" ? "; " : ", "),
        ]), ts.factory.createToken(ts.SyntaxKind.QuestionDotToken), ts.factory.createIdentifier("map")), undefined, undefined, [reader]);
        return ts.factory.createConditionalExpression(ExpressionFactory.isArray(props.input), undefined, ts.factory.createCallExpression(IdentifierFactory.access(props.input, "map"), undefined, [reader]), undefined, props.value.isRequired() === false
            ? split
            : ts.factory.createBinaryExpression(split, ts.factory.createToken(ts.SyntaxKind.QuestionQuestionToken), ts.factory.createArrayLiteralExpression([], false)));
    };
})(HttpHeadersProgrammer || (HttpHeadersProgrammer = {}));
const SINGULAR = new Set([
    "age",
    "authorization",
    "content-length",
    "content-type",
    "etag",
    "expires",
    "from",
    "host",
    "if-modified-since",
    "if-unmodified-since",
    "last-modified",
    "location",
    "max-forwards",
    "proxy-authorization",
    "referer",
    "retry-after",
    "server",
    "user-agent",
]);

export { HttpHeadersProgrammer };
//# sourceMappingURL=HttpHeadersProgrammer.mjs.map
