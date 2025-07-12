"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonSchemasTransformer = void 0;
const typescript_1 = __importDefault(require("typescript"));
const LiteralFactory_1 = require("../../../factories/LiteralFactory");
const MetadataCollection_1 = require("../../../factories/MetadataCollection");
const MetadataFactory_1 = require("../../../factories/MetadataFactory");
const JsonSchemasProgrammer_1 = require("../../../programmers/json/JsonSchemasProgrammer");
const TransformerError_1 = require("../../TransformerError");
var JsonSchemasTransformer;
(function (JsonSchemasTransformer) {
    JsonSchemasTransformer.transform = (props) => {
        var _a;
        if (!((_a = props.expression.typeArguments) === null || _a === void 0 ? void 0 : _a.length))
            throw new TransformerError_1.TransformerError({
                code: "typia.json.schemas",
                message: "no generic argument.",
            });
        //----
        // GET ARGUMENTS
        //----
        // VALIDATE TUPLE ARGUMENTS
        const top = props.expression.typeArguments[0];
        if (!typescript_1.default.isTupleTypeNode(top))
            return props.expression;
        else if (top.elements.some((child) => !typescript_1.default.isTypeNode(child)))
            return props.expression;
        // GET TYPES
        const types = top.elements.map((child) => props.context.checker.getTypeFromTypeNode(child));
        if (types.some((t) => t.isTypeParameter()))
            throw new TransformerError_1.TransformerError({
                code: "typia.json.schemas",
                message: "non-specified generic argument(s).",
            });
        // ADDITIONAL PARAMETERS
        const version = getParameter({
            checker: props.context.checker,
            name: "Version",
            is: (str) => str === "3.0" || str === "3.1",
            cast: (str) => str,
            default: () => "3.1",
        })(props.expression.typeArguments[1]);
        //----
        // GENERATORS
        //----
        // METADATA
        const analyze = (validate) => {
            const results = types.map((type) => MetadataFactory_1.MetadataFactory.analyze({
                checker: props.context.checker,
                transformer: props.context.transformer,
                options: {
                    absorb: validate,
                    constant: true,
                    escape: true,
                    validate: validate === true ? JsonSchemasProgrammer_1.JsonSchemasProgrammer.validate : undefined,
                },
                collection: new MetadataCollection_1.MetadataCollection({
                    replace: MetadataCollection_1.MetadataCollection.replace,
                }),
                type,
            }));
            const metadatas = [];
            const errors = [];
            for (const r of results) {
                if (r.success === false)
                    errors.push(...r.errors);
                else
                    metadatas.push(r.data);
            }
            if (errors.length)
                throw TransformerError_1.TransformerError.from({
                    code: "typia.json.schemas",
                    errors,
                });
            return metadatas;
        };
        analyze(true);
        // APPLICATION
        const collection = JsonSchemasProgrammer_1.JsonSchemasProgrammer.write({
            version,
            metadatas: analyze(false),
        });
        return typescript_1.default.factory.createAsExpression(LiteralFactory_1.LiteralFactory.write(collection), props.context.importer.type({
            file: "typia",
            name: "IJsonSchemaCollection",
            arguments: [
                typescript_1.default.factory.createLiteralTypeNode(typescript_1.default.factory.createStringLiteral(version)),
            ],
        }));
    };
    const getParameter = (props) => (node) => {
        if (!node)
            return props.default();
        // CHECK LITERAL TYPE
        const type = props.checker.getTypeFromTypeNode(node);
        if (!type.isLiteral() &&
            (type.getFlags() & typescript_1.default.TypeFlags.BooleanLiteral) === 0)
            throw new TransformerError_1.TransformerError({
                code: "typia.json.schemas",
                message: `generic argument "${props.name}" must be constant.`,
            });
        // GET VALUE AND VALIDATE IT
        const value = type.isLiteral()
            ? type.value
            : props.checker.typeToString(type);
        if (typeof value !== "string" || props.is(value) === false)
            throw new TransformerError_1.TransformerError({
                code: "typia.json.schemas",
                message: `invalid value on generic argument "${props.name}".`,
            });
        return props.cast(value);
    };
})(JsonSchemasTransformer || (exports.JsonSchemasTransformer = JsonSchemasTransformer = {}));
//# sourceMappingURL=JsonSchemasTransformer.js.map