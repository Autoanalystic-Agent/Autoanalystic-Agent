"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpQueryProgrammer = void 0;
const typescript_1 = __importDefault(require("typescript"));
const IdentifierFactory_1 = require("../../factories/IdentifierFactory");
const MetadataCollection_1 = require("../../factories/MetadataCollection");
const MetadataFactory_1 = require("../../factories/MetadataFactory");
const StatementFactory_1 = require("../../factories/StatementFactory");
const TypeFactory_1 = require("../../factories/TypeFactory");
const MetadataArrayType_1 = require("../../schemas/metadata/MetadataArrayType");
const TransformerError_1 = require("../../transformers/TransformerError");
const Escaper_1 = require("../../utils/Escaper");
const StringUtil_1 = require("../../utils/StringUtil");
const FeatureProgrammer_1 = require("../FeatureProgrammer");
const FunctionProgrammer_1 = require("../helpers/FunctionProgrammer");
const HttpMetadataUtil_1 = require("../helpers/HttpMetadataUtil");
var HttpQueryProgrammer;
(function (HttpQueryProgrammer) {
    HttpQueryProgrammer.decompose = (props) => {
        var _a;
        // ANALYZE TYPE
        const collection = new MetadataCollection_1.MetadataCollection();
        const result = MetadataFactory_1.MetadataFactory.analyze({
            checker: props.context.checker,
            transformer: props.context.transformer,
            options: {
                escape: false,
                constant: true,
                absorb: true,
                validate: (meta, explore) => HttpQueryProgrammer.validate(meta, explore, props.allowOptional),
            },
            collection,
            type: props.type,
        });
        if (result.success === false)
            throw TransformerError_1.TransformerError.from({
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
            arrow: typescript_1.default.factory.createArrowFunction(undefined, undefined, [
                IdentifierFactory_1.IdentifierFactory.parameter("input", typescript_1.default.factory.createUnionTypeNode([
                    typescript_1.default.factory.createTypeReferenceNode("string"),
                    props.context.importer.type({
                        file: "typia",
                        name: "IReadableURLSearchParams",
                    }),
                ])),
            ], props.context.importer.type({
                file: "typia",
                name: "Resolved",
                arguments: [
                    typescript_1.default.factory.createTypeReferenceNode((_a = props.name) !== null && _a !== void 0 ? _a : TypeFactory_1.TypeFactory.getFullName({
                        checker: props.context.checker,
                        type: props.type,
                    })),
                ],
            }), undefined, typescript_1.default.factory.createBlock(statements, true)),
        };
    };
    HttpQueryProgrammer.write = (props) => {
        const functor = new FunctionProgrammer_1.FunctionProgrammer(props.modulo.getText());
        const result = HttpQueryProgrammer.decompose(Object.assign(Object.assign({}, props), { functor, allowOptional: !!props.allowOptional }));
        return FeatureProgrammer_1.FeatureProgrammer.writeDecomposed({
            modulo: props.modulo,
            functor,
            result,
        });
    };
    HttpQueryProgrammer.validate = (meta, explore, allowOptional = false) => {
        const errors = [];
        const insert = (msg) => errors.push(msg);
        if (explore.top === true) {
            // TOP MUST BE ONLY OBJECT
            if (meta.objects.length !== 1 || meta.bucket() !== 1)
                insert("only one object type is allowed.");
            if (meta.nullable === true)
                insert("query parameters cannot be null.");
            if (meta.isRequired() === false) {
                if (allowOptional === true) {
                    const everyPropertiesAreOptional = meta.size() === 1 &&
                        meta.objects.length === 1 &&
                        meta.objects[0].type.properties.every((p) => p.value.isRequired() === false);
                    if (everyPropertiesAreOptional === false)
                        insert("query parameters can be optional only when every properties are optional.");
                }
                else
                    insert("query parameters cannot be undefined.");
            }
        }
        else if (explore.nested !== null &&
            explore.nested instanceof MetadataArrayType_1.MetadataArrayType) {
            //----
            // ARRAY
            //----
            const atomics = HttpMetadataUtil_1.HttpMetadataUtil.atomics(meta);
            const expected = meta.atomics.length +
                meta.templates.length +
                meta.constants.map((c) => c.values.length).reduce((a, b) => a + b, 0);
            if (atomics.size > 1)
                insert("union type is not allowed in array.");
            if (meta.size() !== expected)
                insert("only atomic or constant types are allowed in array.");
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
            if (HttpMetadataUtil_1.HttpMetadataUtil.isUnion(meta))
                insert("union type is not allowed.");
            // DO NOT ALLOW NESTED OBJECT
            if (meta.objects.length ||
                meta.sets.length ||
                meta.maps.length ||
                meta.natives.length)
                insert("nested object type is not allowed.");
        }
        return errors;
    };
    const decode_object = (props) => {
        const input = typescript_1.default.factory.createIdentifier("input");
        const output = typescript_1.default.factory.createIdentifier("output");
        return [
            typescript_1.default.factory.createExpressionStatement(typescript_1.default.factory.createBinaryExpression(input, typescript_1.default.factory.createToken(typescript_1.default.SyntaxKind.EqualsToken), typescript_1.default.factory.createAsExpression(typescript_1.default.factory.createCallExpression(props.context.importer.internal("httpQueryParseURLSearchParams"), undefined, [input]), props.context.importer.type({
                file: "typia",
                name: "IReadableURLSearchParams",
            })))),
            StatementFactory_1.StatementFactory.constant({
                name: "output",
                value: typescript_1.default.factory.createObjectLiteralExpression(props.object.properties.map((p) => decode_regular_property({
                    context: props.context,
                    property: p,
                })), true),
            }),
            typescript_1.default.factory.createReturnStatement(typescript_1.default.factory.createAsExpression(output, TypeFactory_1.TypeFactory.keyword("any"))),
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
                        var _a, _b;
                        const meta = (_b = (_a = value.arrays[0]) === null || _a === void 0 ? void 0 : _a.type.value) !== null && _b !== void 0 ? _b : value.tuples[0].type.elements[0];
                        return meta.atomics.length
                            ? [meta.atomics[0].type, true]
                            : meta.templates.length
                                ? ["string", true]
                                : [meta.constants[0].type, true];
                    })();
        return typescript_1.default.factory.createPropertyAssignment(Escaper_1.Escaper.variable(key) ? key : typescript_1.default.factory.createStringLiteral(key), isArray
            ? decode_array({
                context: props.context,
                metadata: value,
                input: typescript_1.default.factory.createCallExpression(IdentifierFactory_1.IdentifierFactory.access(typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createIdentifier("input.getAll"), undefined, [typescript_1.default.factory.createStringLiteral(key)]), "map"), undefined, [
                    typescript_1.default.factory.createArrowFunction(undefined, undefined, [IdentifierFactory_1.IdentifierFactory.parameter("elem")], undefined, undefined, decode_value({
                        context: props.context,
                        type,
                        coalesce: false,
                        input: typescript_1.default.factory.createIdentifier("elem"),
                    })),
                ]),
            })
            : decode_value({
                context: props.context,
                type,
                coalesce: value.nullable === false && value.isRequired() === false,
                input: typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createIdentifier("input.get"), undefined, [typescript_1.default.factory.createStringLiteral(key)]),
            }));
    };
    const decode_value = (props) => {
        const call = typescript_1.default.factory.createCallExpression(props.context.importer.internal(`httpQueryRead${StringUtil_1.StringUtil.capitalize(props.type)}`), undefined, [props.input]);
        return props.coalesce
            ? typescript_1.default.factory.createBinaryExpression(call, typescript_1.default.factory.createToken(typescript_1.default.SyntaxKind.QuestionQuestionToken), typescript_1.default.factory.createIdentifier("undefined"))
            : call;
    };
    const decode_array = (props) => props.metadata.nullable || props.metadata.isRequired() === false
        ? typescript_1.default.factory.createCallExpression(props.context.importer.internal("httpQueryReadArray"), undefined, [
            props.input,
            props.metadata.nullable
                ? typescript_1.default.factory.createNull()
                : typescript_1.default.factory.createIdentifier("undefined"),
        ])
        : props.input;
})(HttpQueryProgrammer || (exports.HttpQueryProgrammer = HttpQueryProgrammer = {}));
//# sourceMappingURL=HttpQueryProgrammer.js.map