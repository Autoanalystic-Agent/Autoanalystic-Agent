"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtobufDecodeProgrammer = void 0;
const typescript_1 = __importDefault(require("typescript"));
const ExpressionFactory_1 = require("../../factories/ExpressionFactory");
const IdentifierFactory_1 = require("../../factories/IdentifierFactory");
const MetadataCollection_1 = require("../../factories/MetadataCollection");
const MetadataFactory_1 = require("../../factories/MetadataFactory");
const ProtobufFactory_1 = require("../../factories/ProtobufFactory");
const StatementFactory_1 = require("../../factories/StatementFactory");
const TypeFactory_1 = require("../../factories/TypeFactory");
const MetadataObjectType_1 = require("../../schemas/metadata/MetadataObjectType");
const MetadataProperty_1 = require("../../schemas/metadata/MetadataProperty");
const FeatureProgrammer_1 = require("../FeatureProgrammer");
const FunctionProgrammer_1 = require("../helpers/FunctionProgrammer");
const ProtobufUtil_1 = require("../helpers/ProtobufUtil");
var ProtobufDecodeProgrammer;
(function (ProtobufDecodeProgrammer) {
    ProtobufDecodeProgrammer.decompose = (props) => {
        var _a;
        const collection = new MetadataCollection_1.MetadataCollection();
        const meta = ProtobufFactory_1.ProtobufFactory.metadata({
            method: props.modulo.getText(),
            checker: props.context.checker,
            transformer: props.context.transformer,
            collection,
            type: props.type,
        });
        return {
            functions: Object.fromEntries(collection
                .objects()
                .filter((object) => ProtobufUtil_1.ProtobufUtil.isStaticObject(object))
                .map((object) => [
                `${PREFIX}o${object.index}`,
                StatementFactory_1.StatementFactory.constant({
                    name: props.functor.useLocal(`${PREFIX}o${object.index}`),
                    value: write_object_function({
                        context: props.context,
                        functor: props.functor,
                        object,
                    }),
                }),
            ])),
            statements: [],
            arrow: typescript_1.default.factory.createArrowFunction(undefined, undefined, [
                IdentifierFactory_1.IdentifierFactory.parameter("input", typescript_1.default.factory.createTypeReferenceNode("Uint8Array")),
            ], props.context.importer.type({
                file: "typia",
                name: "Resolved",
                arguments: [
                    typescript_1.default.factory.createTypeReferenceNode((_a = props.name) !== null && _a !== void 0 ? _a : TypeFactory_1.TypeFactory.getFullName({
                        checker: props.context.checker,
                        type: props.type,
                    })),
                ],
            }), undefined, typescript_1.default.factory.createBlock([
                StatementFactory_1.StatementFactory.constant({
                    name: "reader",
                    value: typescript_1.default.factory.createNewExpression(props.context.importer.internal("ProtobufReader"), undefined, [typescript_1.default.factory.createIdentifier("input")]),
                }),
                typescript_1.default.factory.createReturnStatement(decode_regular_object({
                    top: true,
                    object: meta.objects[0].type,
                })),
            ], true)),
        };
    };
    ProtobufDecodeProgrammer.write = (props) => {
        const functor = new FunctionProgrammer_1.FunctionProgrammer(props.modulo.getText());
        const result = ProtobufDecodeProgrammer.decompose(Object.assign(Object.assign({}, props), { functor }));
        return FeatureProgrammer_1.FeatureProgrammer.writeDecomposed({
            modulo: props.modulo,
            functor,
            result,
        });
    };
    const write_object_function = (props) => typescript_1.default.factory.createArrowFunction(undefined, undefined, [
        IdentifierFactory_1.IdentifierFactory.parameter("reader"),
        IdentifierFactory_1.IdentifierFactory.parameter("length", TypeFactory_1.TypeFactory.keyword("number"), ExpressionFactory_1.ExpressionFactory.number(-1)),
    ], TypeFactory_1.TypeFactory.keyword("any"), undefined, typescript_1.default.factory.createBlock([
        typescript_1.default.factory.createExpressionStatement(typescript_1.default.factory.createBinaryExpression(typescript_1.default.factory.createIdentifier("length"), typescript_1.default.factory.createToken(typescript_1.default.SyntaxKind.EqualsToken), typescript_1.default.factory.createConditionalExpression(typescript_1.default.factory.createLessThan(typescript_1.default.factory.createIdentifier("length"), ExpressionFactory_1.ExpressionFactory.number(0)), undefined, callReader("size"), undefined, typescript_1.default.factory.createAdd(callReader("index"), typescript_1.default.factory.createIdentifier("length"))))),
        ...write_object_function_body({
            context: props.context,
            condition: typescript_1.default.factory.createLessThan(callReader("index"), typescript_1.default.factory.createIdentifier("length")),
            tag: "tag",
            output: "output",
            object: props.object,
        }),
        typescript_1.default.factory.createReturnStatement(typescript_1.default.factory.createIdentifier("output")),
    ], true));
    const write_object_function_body = (props) => {
        if (props.object.properties.some((p) => p.of_protobuf_ === undefined))
            ProtobufFactory_1.ProtobufFactory.emplaceObject(props.object);
        const clauses = props.object.properties
            .map((p) => decode_property({
            context: props.context,
            accessor: IdentifierFactory_1.IdentifierFactory.access(typescript_1.default.factory.createIdentifier(props.output), p.key.getSoleLiteral()),
            protobuf: p.of_protobuf_,
            metadata: p.value,
        }))
            .flat();
        return [
            StatementFactory_1.StatementFactory.constant({
                name: props.output,
                value: typescript_1.default.factory.createAsExpression(typescript_1.default.factory.createObjectLiteralExpression(props.object.properties
                    .filter((p) => !(props.context.compilerOptions.exactOptionalPropertyTypes ===
                    true && p.value.optional === true))
                    .map((p) => typescript_1.default.factory.createPropertyAssignment(IdentifierFactory_1.IdentifierFactory.identifier(p.key.getSoleLiteral()), write_property_default_value(p.value))), true), TypeFactory_1.TypeFactory.keyword("any")),
            }),
            typescript_1.default.factory.createWhileStatement(props.condition, typescript_1.default.factory.createBlock([
                StatementFactory_1.StatementFactory.constant({
                    name: props.tag,
                    value: callReader("uint32"),
                }),
                typescript_1.default.factory.createSwitchStatement(typescript_1.default.factory.createUnsignedRightShift(typescript_1.default.factory.createIdentifier(props.tag), ExpressionFactory_1.ExpressionFactory.number(3)), typescript_1.default.factory.createCaseBlock([
                    ...clauses,
                    typescript_1.default.factory.createDefaultClause([
                        typescript_1.default.factory.createExpressionStatement(callReader("skipType", [
                            typescript_1.default.factory.createBitwiseAnd(typescript_1.default.factory.createIdentifier(props.tag), ExpressionFactory_1.ExpressionFactory.number(7)),
                        ])),
                        typescript_1.default.factory.createBreakStatement(),
                    ]),
                ])),
            ])),
        ];
    };
    const write_property_default_value = (value) => typescript_1.default.factory.createAsExpression(value.nullable
        ? typescript_1.default.factory.createNull()
        : value.isRequired() === false
            ? typescript_1.default.factory.createIdentifier("undefined")
            : value.arrays.length
                ? typescript_1.default.factory.createArrayLiteralExpression()
                : value.maps.length
                    ? typescript_1.default.factory.createNewExpression(typescript_1.default.factory.createIdentifier("Map"), undefined, [])
                    : value.natives.length
                        ? typescript_1.default.factory.createNewExpression(typescript_1.default.factory.createIdentifier("Uint8Array"), undefined, [typescript_1.default.factory.createArrayLiteralExpression([])])
                        : value.atomics.some((a) => a.type === "string") ||
                            value.constants.some((c) => c.type === "string" &&
                                c.values.some((v) => v.value === "")) ||
                            value.templates.some((tpl) => tpl.row.length === 1 &&
                                tpl.row[0].getName() === "string")
                            ? typescript_1.default.factory.createStringLiteral("")
                            : value.objects.length &&
                                value.objects.some((obj) => !ProtobufUtil_1.ProtobufUtil.isStaticObject(obj.type))
                                ? typescript_1.default.factory.createObjectLiteralExpression()
                                : typescript_1.default.factory.createIdentifier("undefined"), TypeFactory_1.TypeFactory.keyword("any"));
    /* -----------------------------------------------------------
      DECODERS
    ----------------------------------------------------------- */
    const decode_property = (props) => props.protobuf.union.map((schema) => decode_property_type({
        context: props.context,
        accessor: props.accessor,
        schema,
        required: props.metadata.isRequired() && props.metadata.nullable === false,
    }));
    const decode_property_type = (props) => {
        const out = (title, value) => typescript_1.default.factory.createCaseClause(ExpressionFactory_1.ExpressionFactory.number(props.schema.index), [
            typescript_1.default.factory.createExpressionStatement(typescript_1.default.factory.createIdentifier(`// ${title}`)),
            ...(Array.isArray(value)
                ? value
                : [
                    typescript_1.default.factory.createExpressionStatement(typescript_1.default.factory.createBinaryExpression(props.accessor, typescript_1.default.factory.createToken(typescript_1.default.SyntaxKind.EqualsToken), value)),
                ]),
            typescript_1.default.factory.createBreakStatement(),
        ]);
        // ATOMICS
        if (props.schema.type === "bytes")
            return out("bytes", callReader("bytes"));
        else if (props.schema.type === "bool")
            return out("bool", callReader("bool"));
        else if (props.schema.type === "bigint")
            return out(props.schema.name, callReader(props.schema.name));
        else if (props.schema.type === "number")
            return out(props.schema.name, decode_number(props.schema));
        else if (props.schema.type === "string")
            return out("string", callReader("string"));
        // INSTANCES
        else if (props.schema.type === "array")
            return out(`Array<${props.schema.array.value.getName()}>`, decode_array({
                accessor: props.accessor,
                schema: props.schema,
                required: props.required,
            }));
        else if (props.schema.type === "object")
            return out(props.schema.object.name, decode_regular_object({
                top: false,
                object: props.schema.object,
            }));
        else if (props.schema.type === "map")
            if (props.schema.map instanceof MetadataObjectType_1.MetadataObjectType) {
                const key = props.schema.map.properties[0].key;
                const value = props.schema.map.properties[0].value;
                return out(`Record<${key.getName()}, ${value.getName()}>`, decode_map({
                    context: props.context,
                    accessor: props.accessor,
                    schema: props.schema,
                    required: props.required,
                    key,
                    value,
                    initializer: typescript_1.default.factory.createObjectLiteralExpression([]),
                    setter: () => typescript_1.default.factory.createBinaryExpression(typescript_1.default.factory.createElementAccessExpression(props.accessor, typescript_1.default.factory.createIdentifier("entry.key")), typescript_1.default.factory.createToken(typescript_1.default.SyntaxKind.EqualsToken), typescript_1.default.factory.createIdentifier("entry.value")),
                }));
            }
            else {
                const key = props.schema.map.key;
                const value = props.schema.map.value;
                return out(`Map<${key.getName()}, ${value.getName()}>`, decode_map({
                    context: props.context,
                    accessor: props.accessor,
                    schema: props.schema,
                    required: props.required,
                    key,
                    value,
                    initializer: typescript_1.default.factory.createNewExpression(typescript_1.default.factory.createIdentifier("Map"), [TypeFactory_1.TypeFactory.keyword("any"), TypeFactory_1.TypeFactory.keyword("any")], []),
                    setter: () => typescript_1.default.factory.createCallExpression(IdentifierFactory_1.IdentifierFactory.access(props.accessor, "set"), undefined, [
                        typescript_1.default.factory.createIdentifier("entry.key"),
                        typescript_1.default.factory.createIdentifier("entry.value"),
                    ]),
                }));
            }
        throw new Error("Error on ProtobufDecodeProgrammer.write(): unknown property type");
    };
    const decode_number = (schema) => {
        const value = callReader(schema.name);
        return schema.name === "int64" || schema.name === "uint64"
            ? typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createIdentifier("Number"), undefined, [value])
            : value;
    };
    const decode_array = (props) => {
        const statements = [];
        if (props.required === false)
            statements.push(typescript_1.default.factory.createBinaryExpression(props.accessor, typescript_1.default.factory.createToken(typescript_1.default.SyntaxKind.QuestionQuestionEqualsToken), typescript_1.default.factory.createAsExpression(typescript_1.default.factory.createArrayLiteralExpression(), typescript_1.default.factory.createTypeReferenceNode("any[]"))));
        const decoder = decode_array_value(props.schema.value);
        if (["bool", "bigint", "number"].includes(props.schema.value.type)) {
            statements.push(typescript_1.default.factory.createIfStatement(typescript_1.default.factory.createStrictEquality(ExpressionFactory_1.ExpressionFactory.number(2), typescript_1.default.factory.createBitwiseAnd(typescript_1.default.factory.createIdentifier("tag"), ExpressionFactory_1.ExpressionFactory.number(7))), typescript_1.default.factory.createBlock([
                StatementFactory_1.StatementFactory.constant({
                    name: "piece",
                    value: typescript_1.default.factory.createAdd(callReader("uint32"), callReader("index")),
                }),
                typescript_1.default.factory.createWhileStatement(typescript_1.default.factory.createLessThan(callReader("index"), typescript_1.default.factory.createIdentifier("piece")), typescript_1.default.factory.createExpressionStatement(typescript_1.default.factory.createCallExpression(IdentifierFactory_1.IdentifierFactory.access(props.accessor, "push"), undefined, [decoder]))),
            ], true), typescript_1.default.factory.createExpressionStatement(typescript_1.default.factory.createCallExpression(IdentifierFactory_1.IdentifierFactory.access(props.accessor, "push"), undefined, [decoder]))));
        }
        else
            statements.push(typescript_1.default.factory.createCallExpression(IdentifierFactory_1.IdentifierFactory.access(props.accessor, "push"), undefined, [decoder]));
        return statements.map((stmt) => typescript_1.default.isExpression(stmt) ? typescript_1.default.factory.createExpressionStatement(stmt) : stmt);
    };
    const decode_regular_object = (props) => typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createIdentifier(`${PREFIX}o${props.object.index}`), undefined, [
        typescript_1.default.factory.createIdentifier("reader"),
        ...(props.top ? [] : [callReader("uint32")]),
    ]);
    const decode_map = (props) => {
        const statements = [
            ...(props.required === true
                ? [
                    typescript_1.default.factory.createBinaryExpression(props.accessor, typescript_1.default.factory.createToken(typescript_1.default.SyntaxKind.QuestionQuestionEqualsToken), props.initializer),
                ]
                : []),
            StatementFactory_1.StatementFactory.constant({
                name: "piece",
                value: typescript_1.default.factory.createAdd(callReader("uint32"), callReader("index")),
            }),
            ...write_object_function_body({
                context: props.context,
                condition: typescript_1.default.factory.createLessThan(callReader("index"), typescript_1.default.factory.createIdentifier("piece")),
                tag: "kind",
                output: "entry",
                object: createObjectType([
                    {
                        key: "key",
                        value: props.key,
                    },
                    {
                        key: "value",
                        value: props.value,
                    },
                ]),
            }),
            ...(props.required === false
                ? [
                    typescript_1.default.factory.createBinaryExpression(props.accessor, typescript_1.default.factory.createToken(typescript_1.default.SyntaxKind.QuestionQuestionEqualsToken), props.initializer),
                ]
                : []),
            props.setter(),
        ];
        return [
            typescript_1.default.factory.createExpressionStatement(ExpressionFactory_1.ExpressionFactory.selfCall(typescript_1.default.factory.createBlock(statements.map((stmt) => typescript_1.default.isExpression(stmt)
                ? typescript_1.default.factory.createExpressionStatement(stmt)
                : stmt), true))),
        ];
    };
    const decode_array_value = (schema) => {
        if (schema.type === "bytes")
            return callReader("bytes");
        else if (schema.type === "bool")
            return callReader("bool");
        else if (schema.type === "bigint")
            return callReader(schema.name);
        else if (schema.type === "number")
            return decode_number(schema);
        else if (schema.type === "string")
            return callReader("string");
        else if (schema.type === "object")
            return decode_regular_object({
                top: false,
                object: schema.object,
            });
        throw new Error("unreachable condition");
    };
})(ProtobufDecodeProgrammer || (exports.ProtobufDecodeProgrammer = ProtobufDecodeProgrammer = {}));
const PREFIX = "_pd";
const callReader = (method, args) => typescript_1.default.factory.createCallExpression(IdentifierFactory_1.IdentifierFactory.access(typescript_1.default.factory.createIdentifier("reader"), method), undefined, args);
const createObjectType = (definitions) => {
    const properties = definitions.map((def) => MetadataProperty_1.MetadataProperty.create({
        key: MetadataFactory_1.MetadataFactory.soleLiteral(def.key),
        value: def.value,
        description: null,
        jsDocTags: [],
    }));
    const obj = MetadataObjectType_1.MetadataObjectType.create({
        name: "object.o" + Math.random().toString().slice(2),
        properties,
        description: undefined,
        jsDocTags: [],
        index: -1,
        validated: true,
        recursive: false,
        nullables: [false],
    });
    ProtobufFactory_1.ProtobufFactory.emplaceObject(obj);
    return obj;
};
//# sourceMappingURL=ProtobufDecodeProgrammer.js.map