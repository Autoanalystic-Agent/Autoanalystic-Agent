"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpParameterProgrammer = void 0;
const typescript_1 = __importDefault(require("typescript"));
const IdentifierFactory_1 = require("../../factories/IdentifierFactory");
const MetadataCollection_1 = require("../../factories/MetadataCollection");
const MetadataFactory_1 = require("../../factories/MetadataFactory");
const StatementFactory_1 = require("../../factories/StatementFactory");
const TypeFactory_1 = require("../../factories/TypeFactory");
const TransformerError_1 = require("../../transformers/TransformerError");
const StringUtil_1 = require("../../utils/StringUtil");
const AssertProgrammer_1 = require("../AssertProgrammer");
const HttpMetadataUtil_1 = require("../helpers/HttpMetadataUtil");
var HttpParameterProgrammer;
(function (HttpParameterProgrammer) {
    HttpParameterProgrammer.write = (props) => {
        var _a;
        const result = MetadataFactory_1.MetadataFactory.analyze({
            checker: props.context.checker,
            transformer: props.context.transformer,
            options: {
                escape: false,
                constant: true,
                absorb: true,
                validate: HttpParameterProgrammer.validate,
            },
            collection: new MetadataCollection_1.MetadataCollection(),
            type: props.type,
        });
        if (result.success === false)
            throw TransformerError_1.TransformerError.from({
                code: props.modulo.getText(),
                errors: result.errors,
            });
        const atomic = [...HttpMetadataUtil_1.HttpMetadataUtil.atomics(result.data)][0];
        const block = [
            StatementFactory_1.StatementFactory.constant({
                name: "assert",
                value: AssertProgrammer_1.AssertProgrammer.write(Object.assign(Object.assign({}, props), { context: Object.assign(Object.assign({}, props.context), { options: {
                            numeric: true,
                        } }), config: {
                        equals: false,
                        guard: false,
                    } })),
            }),
            StatementFactory_1.StatementFactory.constant({
                name: "value",
                value: typescript_1.default.factory.createCallExpression(props.context.importer.internal(`httpParameterRead${StringUtil_1.StringUtil.capitalize(atomic)}`), undefined, [typescript_1.default.factory.createIdentifier("input")]),
            }),
            typescript_1.default.factory.createReturnStatement(typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createIdentifier("assert"), undefined, [typescript_1.default.factory.createIdentifier("value")])),
        ];
        return typescript_1.default.factory.createArrowFunction(undefined, undefined, [
            IdentifierFactory_1.IdentifierFactory.parameter("input", typescript_1.default.factory.createTypeReferenceNode("string")),
        ], typescript_1.default.factory.createTypeReferenceNode((_a = props.name) !== null && _a !== void 0 ? _a : TypeFactory_1.TypeFactory.getFullName({
            checker: props.context.checker,
            type: props.type,
        })), undefined, typescript_1.default.factory.createBlock(block, true));
    };
    HttpParameterProgrammer.validate = (meta) => {
        const errors = [];
        const insert = (msg) => errors.push(msg);
        if (meta.any)
            insert("do not allow any type");
        if (meta.isRequired() === false)
            insert("do not allow undefindable type");
        const atomics = HttpMetadataUtil_1.HttpMetadataUtil.atomics(meta);
        const expected = meta.atomics.length +
            meta.templates.length +
            meta.constants.map((c) => c.values.length).reduce((a, b) => a + b, 0);
        if (meta.size() !== expected || atomics.size === 0)
            insert("only atomic or constant types are allowed");
        if (atomics.size > 1)
            insert("do not allow union type");
        return errors;
    };
})(HttpParameterProgrammer || (exports.HttpParameterProgrammer = HttpParameterProgrammer = {}));
//# sourceMappingURL=HttpParameterProgrammer.js.map