"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtobufEncodeProgrammer = void 0;
const typescript_1 = __importDefault(require("typescript"));
const ExpressionFactory_1 = require("../../factories/ExpressionFactory");
const IdentifierFactory_1 = require("../../factories/IdentifierFactory");
const MetadataCollection_1 = require("../../factories/MetadataCollection");
const NumericRangeFactory_1 = require("../../factories/NumericRangeFactory");
const ProtobufFactory_1 = require("../../factories/ProtobufFactory");
const StatementFactory_1 = require("../../factories/StatementFactory");
const TypeFactory_1 = require("../../factories/TypeFactory");
const MetadataMap_1 = require("../../schemas/metadata/MetadataMap");
const MetadataObjectType_1 = require("../../schemas/metadata/MetadataObjectType");
const FeatureProgrammer_1 = require("../FeatureProgrammer");
const IsProgrammer_1 = require("../IsProgrammer");
const FunctionProgrammer_1 = require("../helpers/FunctionProgrammer");
const ProtobufUtil_1 = require("../helpers/ProtobufUtil");
const UnionPredicator_1 = require("../helpers/UnionPredicator");
const decode_union_object_1 = require("../internal/decode_union_object");
var ProtobufEncodeProgrammer;
(function (ProtobufEncodeProgrammer) {
    ProtobufEncodeProgrammer.decompose = (props) => {
        var _a;
        const collection = new MetadataCollection_1.MetadataCollection();
        const metadata = ProtobufFactory_1.ProtobufFactory.metadata({
            method: props.modulo.getText(),
            checker: props.context.checker,
            transformer: props.context.transformer,
            collection,
            type: props.type,
        });
        const callEncoder = (writer, factory) => StatementFactory_1.StatementFactory.constant({
            name: writer,
            value: typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createIdentifier("encoder"), undefined, [factory, typescript_1.default.factory.createIdentifier("input")]),
        });
        return {
            functions: {
                encoder: StatementFactory_1.StatementFactory.constant({
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
            arrow: typescript_1.default.factory.createArrowFunction(undefined, undefined, [
                IdentifierFactory_1.IdentifierFactory.parameter("input", typescript_1.default.factory.createTypeReferenceNode((_a = props.name) !== null && _a !== void 0 ? _a : TypeFactory_1.TypeFactory.getFullName({
                    checker: props.context.checker,
                    type: props.type,
                }))),
            ], typescript_1.default.factory.createTypeReferenceNode("Uint8Array"), undefined, typescript_1.default.factory.createBlock([
                callEncoder("sizer", typescript_1.default.factory.createNewExpression(props.context.importer.internal("ProtobufSizer"), undefined, [])),
                callEncoder("writer", typescript_1.default.factory.createNewExpression(props.context.importer.internal("ProtobufWriter"), undefined, [typescript_1.default.factory.createIdentifier("sizer")])),
                typescript_1.default.factory.createReturnStatement(callWriter("buffer")),
            ], true)),
        };
    };
    ProtobufEncodeProgrammer.write = (props) => {
        const functor = new FunctionProgrammer_1.FunctionProgrammer(props.modulo.getText());
        const result = ProtobufEncodeProgrammer.decompose(Object.assign(Object.assign({}, props), { functor }));
        return FeatureProgrammer_1.FeatureProgrammer.writeDecomposed({
            modulo: props.modulo,
            functor,
            result,
        });
    };
    const write_encoder = (props) => {
        var _a, _b;
        const functors = props.collection
            .objects()
            .filter((obj) => ProtobufUtil_1.ProtobufUtil.isStaticObject(obj))
            .map((object) => StatementFactory_1.StatementFactory.constant({
            name: `${PREFIX}o${object.index}`,
            value: write_object_function({
                context: props.context,
                functor: props.functor,
                input: typescript_1.default.factory.createIdentifier("input"),
                object,
                explore: {
                    source: "function",
                    from: "object",
                    tracable: false,
                    postfix: "",
                },
            }),
        }));
        return typescript_1.default.factory.createArrowFunction(undefined, [
            typescript_1.default.factory.createTypeParameterDeclaration(undefined, "Writer", props.context.importer.type({
                file: "typia/lib/internal/_IProtobufWriter.js",
                name: "_IProtobufWriter",
            })),
        ], [
            IdentifierFactory_1.IdentifierFactory.parameter("writer", typescript_1.default.factory.createTypeReferenceNode("Writer")),
            IdentifierFactory_1.IdentifierFactory.parameter("input"),
        ], typescript_1.default.factory.createTypeReferenceNode("Writer"), undefined, typescript_1.default.factory.createBlock([
            ...props.functor.declareUnions(),
            ...functors,
            ...IsProgrammer_1.IsProgrammer.write_function_statements(props),
            typescript_1.default.factory.createExpressionStatement(typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createIdentifier(props.functor.useLocal(`${PREFIX}o${(_b = (_a = props.metadata.objects[0]) === null || _a === void 0 ? void 0 : _a.type.index) !== null && _b !== void 0 ? _b : 0}`)), [], [typescript_1.default.factory.createIdentifier("input")])),
            typescript_1.default.factory.createReturnStatement(typescript_1.default.factory.createIdentifier("writer")),
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
                input: IdentifierFactory_1.IdentifierFactory.access(props.input, p.key.getSoleLiteral()),
            });
            return [
                typescript_1.default.factory.createExpressionStatement(typescript_1.default.factory.createIdentifier(`// property ${JSON.stringify(p.key.getSoleLiteral())}: ${p.value.getName()}`)),
                ...block.statements,
            ];
        })
            .flat();
        return typescript_1.default.factory.createArrowFunction(undefined, undefined, [IdentifierFactory_1.IdentifierFactory.parameter("input")], TypeFactory_1.TypeFactory.keyword("any"), undefined, typescript_1.default.factory.createBlock(body, true));
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
                    is: () => typescript_1.default.factory.createStrictEquality(typescript_1.default.factory.createStringLiteral("boolean"), typescript_1.default.factory.createTypeOfExpression(props.input)),
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
                    is: () => typescript_1.default.factory.createStrictEquality(typescript_1.default.factory.createStringLiteral("string"), typescript_1.default.factory.createTypeOfExpression(props.input)),
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
                    is: () => ExpressionFactory_1.ExpressionFactory.isInstanceOf("Uint8Array", props.input),
                    value: () => decode_bytes({
                        method: "bytes",
                        index: schema.index,
                        input: props.input,
                    }),
                });
            else if (schema.type === "array")
                union.push({
                    is: () => ExpressionFactory_1.ExpressionFactory.isArray(props.input),
                    value: () => decode_array({
                        context: props.context,
                        functor: props.functor,
                        input: props.input,
                        schema,
                    }),
                });
            else if (schema.type === "map" && schema.map instanceof MetadataMap_1.MetadataMap) {
                union.push({
                    is: () => ExpressionFactory_1.ExpressionFactory.isInstanceOf("Map", props.input),
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
                (schema.type === "map" && schema.map instanceof MetadataObjectType_1.MetadataObjectType));
            if (objectSchemas.length !== 0)
                union.push({
                    is: () => ExpressionFactory_1.ExpressionFactory.isObject({
                        checkNull: true,
                        checkArray: false,
                        input: props.input,
                    }),
                    value: () => explore_objects({
                        context: props.context,
                        functor: props.functor,
                        level: 0,
                        schemas: objectSchemas,
                        explore: Object.assign(Object.assign({}, props.explore), { from: "object" }),
                        input: props.input,
                    }),
                });
        }
        // RETURNS
        const wrapper = props.metadata.isRequired() && props.metadata.nullable === false
            ? (block) => block
            : props.metadata.isRequired() === false &&
                props.metadata.nullable === true
                ? (block) => typescript_1.default.factory.createBlock([
                    typescript_1.default.factory.createIfStatement(typescript_1.default.factory.createLogicalAnd(typescript_1.default.factory.createStrictInequality(typescript_1.default.factory.createIdentifier("undefined"), props.input), typescript_1.default.factory.createStrictInequality(typescript_1.default.factory.createNull(), props.input)), block),
                ], true)
                : props.metadata.isRequired() === false
                    ? (block) => typescript_1.default.factory.createBlock([
                        typescript_1.default.factory.createIfStatement(typescript_1.default.factory.createStrictInequality(typescript_1.default.factory.createIdentifier("undefined"), props.input), block),
                    ], true)
                    : (block) => typescript_1.default.factory.createBlock([
                        typescript_1.default.factory.createIfStatement(typescript_1.default.factory.createStrictInequality(typescript_1.default.factory.createNull(), props.input), block),
                    ], true);
        if (union.length === 1)
            return wrapper(union[0].value());
        return wrapper(typescript_1.default.factory.createBlock([
            union
                .map((u, i) => typescript_1.default.factory.createIfStatement(u.is(), u.value(), i === union.length - 1
                ? create_throw_error({
                    context: props.context,
                    functor: props.functor,
                    input: props.input,
                    expected: props.metadata.getName(),
                })
                : undefined))
                .reverse()
                .reduce((a, b) => typescript_1.default.factory.createIfStatement(b.expression, b.thenStatement, a)),
        ], true));
    };
    /* -----------------------------------------------------------
      ATOMIC DECODERS
    ----------------------------------------------------------- */
    const decode_bool = (props) => typescript_1.default.factory.createBlock([
        ...(props.index !== null
            ? [
                decode_tag({
                    wire: 0 /* ProtobufWire.VARIANT */,
                    index: props.index,
                }),
            ]
            : []),
        callWriter("bool", [props.input]),
    ].map((exp) => typescript_1.default.factory.createExpressionStatement(exp)), true);
    const decode_bigint = (props) => ({
        is: () => props.candidates.length === 1
            ? typescript_1.default.factory.createStrictEquality(typescript_1.default.factory.createStringLiteral("bigint"), typescript_1.default.factory.createTypeOfExpression(props.input))
            : typescript_1.default.factory.createLogicalAnd(typescript_1.default.factory.createStrictEquality(typescript_1.default.factory.createStringLiteral("bigint"), typescript_1.default.factory.createTypeOfExpression(props.input)), NumericRangeFactory_1.NumericRangeFactory.bigint(props.type, props.input)),
        value: () => typescript_1.default.factory.createBlock([
            ...(props.index !== null
                ? [
                    decode_tag({
                        wire: 0 /* ProtobufWire.VARIANT */,
                        index: props.index,
                    }),
                ]
                : []),
            callWriter(props.type, [props.input]),
        ].map((exp) => typescript_1.default.factory.createExpressionStatement(exp)), true),
    });
    const decode_number = (props) => ({
        is: () => props.candidates.length === 1
            ? typescript_1.default.factory.createStrictEquality(typescript_1.default.factory.createStringLiteral("number"), typescript_1.default.factory.createTypeOfExpression(props.input))
            : typescript_1.default.factory.createLogicalAnd(typescript_1.default.factory.createStrictEquality(typescript_1.default.factory.createStringLiteral("number"), typescript_1.default.factory.createTypeOfExpression(props.input)), NumericRangeFactory_1.NumericRangeFactory.number(props.type, props.input)),
        value: () => typescript_1.default.factory.createBlock([
            ...(props.index !== null
                ? [
                    decode_tag({
                        wire: get_numeric_wire(props.type),
                        index: props.index,
                    }),
                ]
                : []),
            callWriter(props.type, [props.input]),
        ].map((exp) => typescript_1.default.factory.createExpressionStatement(exp)), true),
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
    const decode_bytes = (props) => typescript_1.default.factory.createBlock([
        decode_tag({
            wire: 2 /* ProtobufWire.LEN */,
            index: props.index,
        }),
        callWriter(props.method, [props.input]),
    ].map((expr) => typescript_1.default.factory.createExpressionStatement(expr)), true);
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
        const forLoop = () => typescript_1.default.factory.createForOfStatement(undefined, typescript_1.default.factory.createVariableDeclarationList([typescript_1.default.factory.createVariableDeclaration("elem")], typescript_1.default.NodeFlags.Const), props.input, decode_container_value({
            kind: "array",
            context: props.context,
            functor: props.functor,
            input: typescript_1.default.factory.createIdentifier("elem"),
            index: props.schema.index,
            schema: props.schema.value,
        }));
        const length = (block) => typescript_1.default.factory.createBlock([
            typescript_1.default.factory.createIfStatement(typescript_1.default.factory.createStrictInequality(ExpressionFactory_1.ExpressionFactory.number(0), IdentifierFactory_1.IdentifierFactory.access(props.input, "length")), block),
        ], true);
        if (wire === 2 /* ProtobufWire.LEN */)
            return length(typescript_1.default.factory.createBlock([forLoop()], true));
        return length(typescript_1.default.factory.createBlock([
            typescript_1.default.factory.createExpressionStatement(decode_tag({
                wire: 2 /* ProtobufWire.LEN */,
                index: props.schema.index,
            })),
            typescript_1.default.factory.createExpressionStatement(callWriter("fork")),
            forLoop(),
            typescript_1.default.factory.createExpressionStatement(callWriter("ldelim")),
        ], true));
    };
    const decode_object = (props) => typescript_1.default.factory.createBlock([
        decode_tag({
            wire: 2 /* ProtobufWire.LEN */,
            index: props.index,
        }),
        callWriter("fork"),
        typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createIdentifier(props.functor.useLocal(`${PREFIX}o${props.schema.object.index}`)), [], [props.input]),
        callWriter("ldelim"),
    ].map(typescript_1.default.factory.createExpressionStatement), true);
    const decode_map = (props) => {
        const each = [
            typescript_1.default.factory.createExpressionStatement(decode_tag({
                wire: 2 /* ProtobufWire.LEN */,
                index: props.schema.index,
            })),
            typescript_1.default.factory.createExpressionStatement(callWriter("fork")),
            ...decode_container_value({
                kind: "map",
                context: props.context,
                functor: props.functor,
                index: 1,
                input: typescript_1.default.factory.createIdentifier("key"),
                schema: props.schema.key,
            }).statements,
            ...decode_container_value({
                kind: "map",
                context: props.context,
                functor: props.functor,
                index: 2,
                input: typescript_1.default.factory.createIdentifier("value"),
                schema: props.schema.value,
            }).statements,
            typescript_1.default.factory.createExpressionStatement(callWriter("ldelim")),
        ];
        return typescript_1.default.factory.createBlock([
            typescript_1.default.factory.createForOfStatement(undefined, StatementFactory_1.StatementFactory.entry({
                key: "key",
                value: "value",
            }), props.input, typescript_1.default.factory.createBlock(each)),
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
                input: typescript_1.default.factory.createCallExpression(IdentifierFactory_1.IdentifierFactory.access(typescript_1.default.factory.createIdentifier("Object"), "entries"), undefined, [props.input]),
            });
        if (props.schemas.length === 1)
            return out(props.schemas[0]);
        const objects = props.schemas.map((s) => s.type === "map" ? s.map : s.object);
        const expected = `(${objects.map((t) => t.name).join(" | ")})`;
        const indexes = new WeakMap(objects.map((o, i) => [o, props.schemas[i]]));
        const specifications = UnionPredicator_1.UnionPredicator.object(objects);
        if (specifications.length === 0) {
            const condition = (0, decode_union_object_1.decode_union_object)({
                checker: (v) => IsProgrammer_1.IsProgrammer.decode_object({
                    context: props.context,
                    functor: props.functor,
                    object: v.object,
                    input: v.input,
                    explore: v.explore,
                }),
                decoder: (v) => ExpressionFactory_1.ExpressionFactory.selfCall(out(indexes.get(v.object))),
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
            return StatementFactory_1.StatementFactory.block(condition);
        }
        const remained = objects.filter((o) => specifications.find((s) => s.object === o) === undefined);
        // DO SPECIALIZE
        const condition = specifications
            .filter((spec) => spec.property.key.getSoleLiteral() !== null)
            .map((spec, i, array) => {
            const key = spec.property.key.getSoleLiteral();
            const accessor = IdentifierFactory_1.IdentifierFactory.access(props.input, key);
            const pred = spec.neighbor
                ? IsProgrammer_1.IsProgrammer.decode({
                    context: props.context,
                    functor: props.functor,
                    input: accessor,
                    metadata: spec.property.value,
                    explore: Object.assign(Object.assign({}, props.explore), { tracable: false, postfix: IdentifierFactory_1.IdentifierFactory.postfix(key) }),
                })
                : ExpressionFactory_1.ExpressionFactory.isRequired(accessor);
            const schema = indexes.get(spec.object);
            return typescript_1.default.factory.createIfStatement(pred, typescript_1.default.factory.createExpressionStatement(ExpressionFactory_1.ExpressionFactory.selfCall(out(schema))), i === array.length - 1
                ? remained.length
                    ? typescript_1.default.factory.createExpressionStatement(ExpressionFactory_1.ExpressionFactory.selfCall(explore_objects({
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
            .reduce((a, b) => typescript_1.default.factory.createIfStatement(b.expression, b.thenStatement, a));
        // RETURNS WITH CONDITIONS
        return typescript_1.default.factory.createBlock([condition], true);
    };
    /* -----------------------------------------------------------
      BACKGROUND FUNCTIONS
    ----------------------------------------------------------- */
    const PREFIX = "_pe";
    const decode_tag = (props) => callWriter("uint32", [
        ExpressionFactory_1.ExpressionFactory.number((props.index << 3) | props.wire),
    ]);
    const get_numeric_wire = (type) => type === "double"
        ? 1 /* ProtobufWire.I64 */
        : type === "float"
            ? 5 /* ProtobufWire.I32 */
            : 0 /* ProtobufWire.VARIANT */;
    const create_throw_error = (props) => typescript_1.default.factory.createExpressionStatement(typescript_1.default.factory.createCallExpression(props.context.importer.internal("throwTypeGuardError"), [], [
        typescript_1.default.factory.createObjectLiteralExpression([
            typescript_1.default.factory.createPropertyAssignment("method", typescript_1.default.factory.createStringLiteral(props.functor.method)),
            typescript_1.default.factory.createPropertyAssignment("expected", typescript_1.default.factory.createStringLiteral(props.expected)),
            typescript_1.default.factory.createPropertyAssignment("value", props.input),
        ], true),
    ]));
})(ProtobufEncodeProgrammer || (exports.ProtobufEncodeProgrammer = ProtobufEncodeProgrammer = {}));
const callWriter = (method, args) => typescript_1.default.factory.createCallExpression(IdentifierFactory_1.IdentifierFactory.access(typescript_1.default.factory.createIdentifier("writer"), method), undefined, args);
//# sourceMappingURL=ProtobufEncodeProgrammer.js.map