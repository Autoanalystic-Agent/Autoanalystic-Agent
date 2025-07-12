import ts from 'typescript';
import { ExpressionFactory } from '../../factories/ExpressionFactory.mjs';
import { IdentifierFactory } from '../../factories/IdentifierFactory.mjs';
import { MetadataCollection } from '../../factories/MetadataCollection.mjs';
import { NumericRangeFactory } from '../../factories/NumericRangeFactory.mjs';
import { ProtobufFactory } from '../../factories/ProtobufFactory.mjs';
import { StatementFactory } from '../../factories/StatementFactory.mjs';
import { TypeFactory } from '../../factories/TypeFactory.mjs';
import { MetadataMap } from '../../schemas/metadata/MetadataMap.mjs';
import { MetadataObjectType } from '../../schemas/metadata/MetadataObjectType.mjs';
import { FeatureProgrammer } from '../FeatureProgrammer.mjs';
import { IsProgrammer } from '../IsProgrammer.mjs';
import { FunctionProgrammer } from '../helpers/FunctionProgrammer.mjs';
import { ProtobufUtil } from '../helpers/ProtobufUtil.mjs';
import { UnionPredicator } from '../helpers/UnionPredicator.mjs';
import { decode_union_object } from '../internal/decode_union_object.mjs';

var ProtobufEncodeProgrammer;
(function (ProtobufEncodeProgrammer) {
    ProtobufEncodeProgrammer.decompose = (props) => {
        const collection = new MetadataCollection();
        const metadata = ProtobufFactory.metadata({
            method: props.modulo.getText(),
            checker: props.context.checker,
            transformer: props.context.transformer,
            collection,
            type: props.type,
        });
        const callEncoder = (writer, factory) => StatementFactory.constant({
            name: writer,
            value: ts.factory.createCallExpression(ts.factory.createIdentifier("encoder"), undefined, [factory, ts.factory.createIdentifier("input")]),
        });
        return {
            functions: {
                encoder: StatementFactory.constant({
                    name: props.functor.useLocal("encoder"),
                    value: write_encoder({
                        context: props.context,
                        functor: props.functor,
                        collection,
                        metadata,
                    }),
                }),
            },
            statements: [],
            arrow: ts.factory.createArrowFunction(undefined, undefined, [
                IdentifierFactory.parameter("input", ts.factory.createTypeReferenceNode(props.name ??
                    TypeFactory.getFullName({
                        checker: props.context.checker,
                        type: props.type,
                    }))),
            ], ts.factory.createTypeReferenceNode("Uint8Array"), undefined, ts.factory.createBlock([
                callEncoder("sizer", ts.factory.createNewExpression(props.context.importer.internal("ProtobufSizer"), undefined, [])),
                callEncoder("writer", ts.factory.createNewExpression(props.context.importer.internal("ProtobufWriter"), undefined, [ts.factory.createIdentifier("sizer")])),
                ts.factory.createReturnStatement(callWriter("buffer")),
            ], true)),
        };
    };
    ProtobufEncodeProgrammer.write = (props) => {
        const functor = new FunctionProgrammer(props.modulo.getText());
        const result = ProtobufEncodeProgrammer.decompose({
            ...props,
            functor,
        });
        return FeatureProgrammer.writeDecomposed({
            modulo: props.modulo,
            functor,
            result,
        });
    };
    const write_encoder = (props) => {
        const functors = props.collection
            .objects()
            .filter((obj) => ProtobufUtil.isStaticObject(obj))
            .map((object) => StatementFactory.constant({
            name: `${PREFIX}o${object.index}`,
            value: write_object_function({
                context: props.context,
                functor: props.functor,
                input: ts.factory.createIdentifier("input"),
                object,
                explore: {
                    source: "function",
                    from: "object",
                    tracable: false,
                    postfix: "",
                },
            }),
        }));
        return ts.factory.createArrowFunction(undefined, [
            ts.factory.createTypeParameterDeclaration(undefined, "Writer", props.context.importer.type({
                file: "typia/lib/internal/_IProtobufWriter.js",
                name: "_IProtobufWriter",
            })),
        ], [
            IdentifierFactory.parameter("writer", ts.factory.createTypeReferenceNode("Writer")),
            IdentifierFactory.parameter("input"),
        ], ts.factory.createTypeReferenceNode("Writer"), undefined, ts.factory.createBlock([
            ...props.functor.declareUnions(),
            ...functors,
            ...IsProgrammer.write_function_statements(props),
            ts.factory.createExpressionStatement(ts.factory.createCallExpression(ts.factory.createIdentifier(props.functor.useLocal(`${PREFIX}o${props.metadata.objects[0]?.type.index ?? 0}`)), [], [ts.factory.createIdentifier("input")])),
            ts.factory.createReturnStatement(ts.factory.createIdentifier("writer")),
        ], true));
    };
    const write_object_function = (props) => {
        const body = props.object.properties
            .map((p) => {
            const block = decode_property({
                context: props.context,
                functor: props.functor,
                explore: props.explore,
                metadata: p.value,
                protobuf: p.of_protobuf_,
                input: IdentifierFactory.access(props.input, p.key.getSoleLiteral()),
            });
            return [
                ts.factory.createExpressionStatement(ts.factory.createIdentifier(`// property ${JSON.stringify(p.key.getSoleLiteral())}: ${p.value.getName()}`)),
                ...block.statements,
            ];
        })
            .flat();
        return ts.factory.createArrowFunction(undefined, undefined, [IdentifierFactory.parameter("input")], TypeFactory.keyword("any"), undefined, ts.factory.createBlock(body, true));
    };
    /* -----------------------------------------------------------
      DECODER STATION
    ----------------------------------------------------------- */
    const decode_property = (props) => {
        const union = [];
        for (const schema of props.protobuf.union) {
            //----
            // ATOMICS
            //----
            if (schema.type === "bool")
                union.push({
                    is: () => ts.factory.createStrictEquality(ts.factory.createStringLiteral("boolean"), ts.factory.createTypeOfExpression(props.input)),
                    value: () => decode_bool({
                        input: props.input,
                        index: schema.index,
                    }),
                });
            else if (schema.type === "bigint")
                union.push(decode_bigint({
                    input: props.input,
                    type: schema.name,
                    candidates: props.protobuf.union
                        .filter((s) => s.type === "bigint")
                        .map((s) => s.name),
                    index: schema.index,
                }));
            else if (schema.type === "number")
                union.push(decode_number({
                    input: props.input,
                    type: schema.name,
                    candidates: props.protobuf.union
                        .filter((s) => s.type === "number")
                        .map((s) => s.name),
                    index: schema.index,
                }));
            else if (schema.type === "string")
                union.push({
                    is: () => ts.factory.createStrictEquality(ts.factory.createStringLiteral("string"), ts.factory.createTypeOfExpression(props.input)),
                    value: () => decode_bytes({
                        method: "string",
                        index: schema.index,
                        input: props.input,
                    }),
                });
            //----
            // INSTANCES
            //----
            else if (schema.type === "bytes")
                union.push({
                    is: () => ExpressionFactory.isInstanceOf("Uint8Array", props.input),
                    value: () => decode_bytes({
                        method: "bytes",
                        index: schema.index,
                        input: props.input,
                    }),
                });
            else if (schema.type === "array")
                union.push({
                    is: () => ExpressionFactory.isArray(props.input),
                    value: () => decode_array({
                        context: props.context,
                        functor: props.functor,
                        input: props.input,
                        schema,
                    }),
                });
            else if (schema.type === "map" && schema.map instanceof MetadataMap) {
                union.push({
                    is: () => ExpressionFactory.isInstanceOf("Map", props.input),
                    value: () => decode_map({
                        context: props.context,
                        functor: props.functor,
                        schema,
                        input: props.input,
                    }),
                });
            }
            const objectSchemas = props.protobuf.union
                .filter((schema) => schema.type === "object" || schema.type === "map")
                .filter((schema) => schema.type === "object" ||
                (schema.type === "map" && schema.map instanceof MetadataObjectType));
            if (objectSchemas.length !== 0)
                union.push({
                    is: () => ExpressionFactory.isObject({
                        checkNull: true,
                        checkArray: false,
                        input: props.input,
                    }),
                    value: () => explore_objects({
                        context: props.context,
                        functor: props.functor,
                        level: 0,
                        schemas: objectSchemas,
                        explore: {
                            ...props.explore,
                            from: "object",
                        },
                        input: props.input,
                    }),
                });
        }
        // RETURNS
        const wrapper = props.metadata.isRequired() && props.metadata.nullable === false
            ? (block) => block
            : props.metadata.isRequired() === false &&
                props.metadata.nullable === true
                ? (block) => ts.factory.createBlock([
                    ts.factory.createIfStatement(ts.factory.createLogicalAnd(ts.factory.createStrictInequality(ts.factory.createIdentifier("undefined"), props.input), ts.factory.createStrictInequality(ts.factory.createNull(), props.input)), block),
                ], true)
                : props.metadata.isRequired() === false
                    ? (block) => ts.factory.createBlock([
                        ts.factory.createIfStatement(ts.factory.createStrictInequality(ts.factory.createIdentifier("undefined"), props.input), block),
                    ], true)
                    : (block) => ts.factory.createBlock([
                        ts.factory.createIfStatement(ts.factory.createStrictInequality(ts.factory.createNull(), props.input), block),
                    ], true);
        if (union.length === 1)
            return wrapper(union[0].value());
        return wrapper(ts.factory.createBlock([
            union
                .map((u, i) => ts.factory.createIfStatement(u.is(), u.value(), i === union.length - 1
                ? create_throw_error({
                    context: props.context,
                    functor: props.functor,
                    input: props.input,
                    expected: props.metadata.getName(),
                })
                : undefined))
                .reverse()
                .reduce((a, b) => ts.factory.createIfStatement(b.expression, b.thenStatement, a)),
        ], true));
    };
    /* -----------------------------------------------------------
      ATOMIC DECODERS
    ----------------------------------------------------------- */
    const decode_bool = (props) => ts.factory.createBlock([
        ...(props.index !== null
            ? [
                decode_tag({
                    wire: 0 /* ProtobufWire.VARIANT */,
                    index: props.index,
                }),
            ]
            : []),
        callWriter("bool", [props.input]),
    ].map((exp) => ts.factory.createExpressionStatement(exp)), true);
    const decode_bigint = (props) => ({
        is: () => props.candidates.length === 1
            ? ts.factory.createStrictEquality(ts.factory.createStringLiteral("bigint"), ts.factory.createTypeOfExpression(props.input))
            : ts.factory.createLogicalAnd(ts.factory.createStrictEquality(ts.factory.createStringLiteral("bigint"), ts.factory.createTypeOfExpression(props.input)), NumericRangeFactory.bigint(props.type, props.input)),
        value: () => ts.factory.createBlock([
            ...(props.index !== null
                ? [
                    decode_tag({
                        wire: 0 /* ProtobufWire.VARIANT */,
                        index: props.index,
                    }),
                ]
                : []),
            callWriter(props.type, [props.input]),
        ].map((exp) => ts.factory.createExpressionStatement(exp)), true),
    });
    const decode_number = (props) => ({
        is: () => props.candidates.length === 1
            ? ts.factory.createStrictEquality(ts.factory.createStringLiteral("number"), ts.factory.createTypeOfExpression(props.input))
            : ts.factory.createLogicalAnd(ts.factory.createStrictEquality(ts.factory.createStringLiteral("number"), ts.factory.createTypeOfExpression(props.input)), NumericRangeFactory.number(props.type, props.input)),
        value: () => ts.factory.createBlock([
            ...(props.index !== null
                ? [
                    decode_tag({
                        wire: get_numeric_wire(props.type),
                        index: props.index,
                    }),
                ]
                : []),
            callWriter(props.type, [props.input]),
        ].map((exp) => ts.factory.createExpressionStatement(exp)), true),
    });
    const decode_container_value = (props) => {
        if (props.schema.type === "bool")
            return decode_bool({
                input: props.input,
                index: props.kind === "array" ? null : props.index,
            });
        else if (props.schema.type === "bigint")
            return decode_bigint({
                input: props.input,
                type: props.schema.name,
                candidates: [props.schema.name],
                index: props.kind === "array" ? null : props.index,
            }).value();
        else if (props.schema.type === "number")
            return decode_number({
                input: props.input,
                type: props.schema.name,
                candidates: [props.schema.name],
                index: props.kind === "array" ? null : props.index,
            }).value();
        else if (props.schema.type === "string" || props.schema.type === "bytes")
            return decode_bytes({
                method: props.schema.type,
                input: props.input,
                index: props.index,
            });
        return decode_object({
            context: props.context,
            functor: props.functor,
            schema: props.schema,
            input: props.input,
            index: props.index,
        });
    };
    /* -----------------------------------------------------------
      INSTANCE DECODERS
    ----------------------------------------------------------- */
    const decode_bytes = (props) => ts.factory.createBlock([
        decode_tag({
            wire: 2 /* ProtobufWire.LEN */,
            index: props.index,
        }),
        callWriter(props.method, [props.input]),
    ].map((expr) => ts.factory.createExpressionStatement(expr)), true);
    const decode_array = (props) => {
        const value = props.schema.value;
        const wire = (() => {
            if (value.type === "object" ||
                value.type === "bytes" ||
                value.type === "string")
                return 2 /* ProtobufWire.LEN */;
            else if (value.type === "number" && value.name === "float")
                return 5 /* ProtobufWire.I32 */;
            return 0 /* ProtobufWire.VARIANT */;
        })();
        const forLoop = () => ts.factory.createForOfStatement(undefined, ts.factory.createVariableDeclarationList([ts.factory.createVariableDeclaration("elem")], ts.NodeFlags.Const), props.input, decode_container_value({
            kind: "array",
            context: props.context,
            functor: props.functor,
            input: ts.factory.createIdentifier("elem"),
            index: props.schema.index,
            schema: props.schema.value,
        }));
        const length = (block) => ts.factory.createBlock([
            ts.factory.createIfStatement(ts.factory.createStrictInequality(ExpressionFactory.number(0), IdentifierFactory.access(props.input, "length")), block),
        ], true);
        if (wire === 2 /* ProtobufWire.LEN */)
            return length(ts.factory.createBlock([forLoop()], true));
        return length(ts.factory.createBlock([
            ts.factory.createExpressionStatement(decode_tag({
                wire: 2 /* ProtobufWire.LEN */,
                index: props.schema.index,
            })),
            ts.factory.createExpressionStatement(callWriter("fork")),
            forLoop(),
            ts.factory.createExpressionStatement(callWriter("ldelim")),
        ], true));
    };
    const decode_object = (props) => ts.factory.createBlock([
        decode_tag({
            wire: 2 /* ProtobufWire.LEN */,
            index: props.index,
        }),
        callWriter("fork"),
        ts.factory.createCallExpression(ts.factory.createIdentifier(props.functor.useLocal(`${PREFIX}o${props.schema.object.index}`)), [], [props.input]),
        callWriter("ldelim"),
    ].map(ts.factory.createExpressionStatement), true);
    const decode_map = (props) => {
        const each = [
            ts.factory.createExpressionStatement(decode_tag({
                wire: 2 /* ProtobufWire.LEN */,
                index: props.schema.index,
            })),
            ts.factory.createExpressionStatement(callWriter("fork")),
            ...decode_container_value({
                kind: "map",
                context: props.context,
                functor: props.functor,
                index: 1,
                input: ts.factory.createIdentifier("key"),
                schema: props.schema.key,
            }).statements,
            ...decode_container_value({
                kind: "map",
                context: props.context,
                functor: props.functor,
                index: 2,
                input: ts.factory.createIdentifier("value"),
                schema: props.schema.value,
            }).statements,
            ts.factory.createExpressionStatement(callWriter("ldelim")),
        ];
        return ts.factory.createBlock([
            ts.factory.createForOfStatement(undefined, StatementFactory.entry({
                key: "key",
                value: "value",
            }), props.input, ts.factory.createBlock(each)),
        ], true);
    };
    const explore_objects = (props) => {
        const out = (schema) => schema.type === "object"
            ? decode_object({
                context: props.context,
                functor: props.functor,
                schema,
                index: schema.index,
                input: props.input,
            })
            : decode_map({
                context: props.context,
                functor: props.functor,
                schema,
                input: ts.factory.createCallExpression(IdentifierFactory.access(ts.factory.createIdentifier("Object"), "entries"), undefined, [props.input]),
            });
        if (props.schemas.length === 1)
            return out(props.schemas[0]);
        const objects = props.schemas.map((s) => s.type === "map" ? s.map : s.object);
        const expected = `(${objects.map((t) => t.name).join(" | ")})`;
        const indexes = new WeakMap(objects.map((o, i) => [o, props.schemas[i]]));
        const specifications = UnionPredicator.object(objects);
        if (specifications.length === 0) {
            const condition = decode_union_object({
                checker: (v) => IsProgrammer.decode_object({
                    context: props.context,
                    functor: props.functor,
                    object: v.object,
                    input: v.input,
                    explore: v.explore,
                }),
                decoder: (v) => ExpressionFactory.selfCall(out(indexes.get(v.object))),
                success: (expr) => expr,
                escaper: (v) => create_throw_error({
                    context: props.context,
                    functor: props.functor,
                    expected: v.expected,
                    input: v.input,
                }),
                input: props.input,
                explore: props.explore,
                objects,
            });
            return StatementFactory.block(condition);
        }
        const remained = objects.filter((o) => specifications.find((s) => s.object === o) === undefined);
        // DO SPECIALIZE
        const condition = specifications
            .filter((spec) => spec.property.key.getSoleLiteral() !== null)
            .map((spec, i, array) => {
            const key = spec.property.key.getSoleLiteral();
            const accessor = IdentifierFactory.access(props.input, key);
            const pred = spec.neighbor
                ? IsProgrammer.decode({
                    context: props.context,
                    functor: props.functor,
                    input: accessor,
                    metadata: spec.property.value,
                    explore: {
                        ...props.explore,
                        tracable: false,
                        postfix: IdentifierFactory.postfix(key),
                    },
                })
                : ExpressionFactory.isRequired(accessor);
            const schema = indexes.get(spec.object);
            return ts.factory.createIfStatement(pred, ts.factory.createExpressionStatement(ExpressionFactory.selfCall(out(schema))), i === array.length - 1
                ? remained.length
                    ? ts.factory.createExpressionStatement(ExpressionFactory.selfCall(explore_objects({
                        context: props.context,
                        functor: props.functor,
                        level: props.level + 1,
                        input: props.input,
                        schemas: remained.map((r) => indexes.get(r)),
                        explore: props.explore,
                    })))
                    : create_throw_error({
                        context: props.context,
                        functor: props.functor,
                        input: props.input,
                        expected,
                    })
                : undefined);
        })
            .reverse()
            .reduce((a, b) => ts.factory.createIfStatement(b.expression, b.thenStatement, a));
        // RETURNS WITH CONDITIONS
        return ts.factory.createBlock([condition], true);
    };
    /* -----------------------------------------------------------
      BACKGROUND FUNCTIONS
    ----------------------------------------------------------- */
    const PREFIX = "_pe";
    const decode_tag = (props) => callWriter("uint32", [
        ExpressionFactory.number((props.index << 3) | props.wire),
    ]);
    const get_numeric_wire = (type) => type === "double"
        ? 1 /* ProtobufWire.I64 */
        : type === "float"
            ? 5 /* ProtobufWire.I32 */
            : 0 /* ProtobufWire.VARIANT */;
    const create_throw_error = (props) => ts.factory.createExpressionStatement(ts.factory.createCallExpression(props.context.importer.internal("throwTypeGuardError"), [], [
        ts.factory.createObjectLiteralExpression([
            ts.factory.createPropertyAssignment("method", ts.factory.createStringLiteral(props.functor.method)),
            ts.factory.createPropertyAssignment("expected", ts.factory.createStringLiteral(props.expected)),
            ts.factory.createPropertyAssignment("value", props.input),
        ], true),
    ]));
})(ProtobufEncodeProgrammer || (ProtobufEncodeProgrammer = {}));
const callWriter = (method, args) => ts.factory.createCallExpression(IdentifierFactory.access(ts.factory.createIdentifier("writer"), method), undefined, args);

export { ProtobufEncodeProgrammer };
//# sourceMappingURL=ProtobufEncodeProgrammer.mjs.map
