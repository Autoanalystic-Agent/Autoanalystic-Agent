"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpHeadersProgrammer = void 0;
const typescript_1 = __importDefault(require("typescript"));
const ExpressionFactory_1 = require("../../factories/ExpressionFactory");
const IdentifierFactory_1 = require("../../factories/IdentifierFactory");
const MetadataCollection_1 = require("../../factories/MetadataCollection");
const MetadataFactory_1 = require("../../factories/MetadataFactory");
const StatementFactory_1 = require("../../factories/StatementFactory");
const TypeFactory_1 = require("../../factories/TypeFactory");
const MetadataArrayType_1 = require("../../schemas/metadata/MetadataArrayType");
const TransformerError_1 = require("../../transformers/TransformerError");
const Escaper_1 = require("../../utils/Escaper");
const MapUtil_1 = require("../../utils/MapUtil");
const StringUtil_1 = require("../../utils/StringUtil");
const FeatureProgrammer_1 = require("../FeatureProgrammer");
const FunctionProgrammer_1 = require("../helpers/FunctionProgrammer");
const HttpMetadataUtil_1 = require("../helpers/HttpMetadataUtil");
var HttpHeadersProgrammer;
(function (HttpHeadersProgrammer) {
    HttpHeadersProgrammer.INPUT_TYPE = "Record<string, string | string[] | undefined>";
    HttpHeadersProgrammer.decompose = (props) => {
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
                validate: HttpHeadersProgrammer.validate,
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
                IdentifierFactory_1.IdentifierFactory.parameter("input", typescript_1.default.factory.createTypeReferenceNode(HttpHeadersProgrammer.INPUT_TYPE)),
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
    HttpHeadersProgrammer.write = (props) => {
        const functor = new FunctionProgrammer_1.FunctionProgrammer(props.modulo.getText());
        const result = HttpHeadersProgrammer.decompose(Object.assign(Object.assign({}, props), { functor }));
        return FeatureProgrammer_1.FeatureProgrammer.writeDecomposed({
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
            explore.nested instanceof MetadataArrayType_1.MetadataArrayType) {
            //----
            // ARRAY
            //----
            const atomics = HttpMetadataUtil_1.HttpMetadataUtil.atomics(metadata);
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
            if (HttpMetadataUtil_1.HttpMetadataUtil.isUnion(metadata))
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
                MapUtil_1.MapUtil.take(counter, key.toLowerCase(), () => new Set()).add(key);
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
        const output = typescript_1.default.factory.createIdentifier("output");
        const optionals = [];
        return [
            StatementFactory_1.StatementFactory.constant({
                name: "output",
                value: typescript_1.default.factory.createObjectLiteralExpression(props.object.properties.map((p) => {
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
                const access = IdentifierFactory_1.IdentifierFactory.access(output, key);
                return typescript_1.default.factory.createIfStatement(typescript_1.default.factory.createStrictEquality(ExpressionFactory_1.ExpressionFactory.number(0), IdentifierFactory_1.IdentifierFactory.access(access, "length")), typescript_1.default.factory.createExpressionStatement(typescript_1.default.factory.createDeleteExpression(access)));
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
        const input = IdentifierFactory_1.IdentifierFactory.access(typescript_1.default.factory.createIdentifier("input"), key.toLowerCase());
        return typescript_1.default.factory.createPropertyAssignment(Escaper_1.Escaper.variable(key) ? key : typescript_1.default.factory.createStringLiteral(key), isArray
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
        : typescript_1.default.factory.createCallExpression(props.context.importer.internal(`httpHeaderRead${StringUtil_1.StringUtil.capitalize(props.type)}`), undefined, [props.input]);
    const decode_array = (props) => {
        const reader = props.type === "string"
            ? typescript_1.default.factory.createArrowFunction(undefined, undefined, [IdentifierFactory_1.IdentifierFactory.parameter("str")], undefined, undefined, typescript_1.default.factory.createCallExpression(IdentifierFactory_1.IdentifierFactory.access(typescript_1.default.factory.createIdentifier("str"), "trim"), undefined, undefined))
            : props.context.importer.internal(`httpHeaderRead${StringUtil_1.StringUtil.capitalize(props.type)}`);
        const split = typescript_1.default.factory.createCallChain(typescript_1.default.factory.createPropertyAccessChain(typescript_1.default.factory.createCallChain(typescript_1.default.factory.createPropertyAccessChain(props.input, typescript_1.default.factory.createToken(typescript_1.default.SyntaxKind.QuestionDotToken), typescript_1.default.factory.createIdentifier("split")), undefined, undefined, [
            typescript_1.default.factory.createStringLiteral(props.key === "cookie" ? "; " : ", "),
        ]), typescript_1.default.factory.createToken(typescript_1.default.SyntaxKind.QuestionDotToken), typescript_1.default.factory.createIdentifier("map")), undefined, undefined, [reader]);
        return typescript_1.default.factory.createConditionalExpression(ExpressionFactory_1.ExpressionFactory.isArray(props.input), undefined, typescript_1.default.factory.createCallExpression(IdentifierFactory_1.IdentifierFactory.access(props.input, "map"), undefined, [reader]), undefined, props.value.isRequired() === false
            ? split
            : typescript_1.default.factory.createBinaryExpression(split, typescript_1.default.factory.createToken(typescript_1.default.SyntaxKind.QuestionQuestionToken), typescript_1.default.factory.createArrayLiteralExpression([], false)));
    };
})(HttpHeadersProgrammer || (exports.HttpHeadersProgrammer = HttpHeadersProgrammer = {}));
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
//# sourceMappingURL=HttpHeadersProgrammer.js.map