"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtobufIsDecodeProgrammer = void 0;
const typescript_1 = __importDefault(require("typescript"));
const StatementFactory_1 = require("../../factories/StatementFactory");
const TypeFactory_1 = require("../../factories/TypeFactory");
const FeatureProgrammer_1 = require("../FeatureProgrammer");
const IsProgrammer_1 = require("../IsProgrammer");
const FunctionProgrammer_1 = require("../helpers/FunctionProgrammer");
const ProtobufDecodeProgrammer_1 = require("./ProtobufDecodeProgrammer");
var ProtobufIsDecodeProgrammer;
(function (ProtobufIsDecodeProgrammer) {
    ProtobufIsDecodeProgrammer.decompose = (props) => {
        var _a;
        const is = IsProgrammer_1.IsProgrammer.decompose(Object.assign(Object.assign({}, props), { context: Object.assign(Object.assign({}, props.context), { options: Object.assign(Object.assign({}, props.context.options), { functional: false, numeric: false }) }), config: {
                equals: false,
            } }));
        const decode = ProtobufDecodeProgrammer_1.ProtobufDecodeProgrammer.decompose(props);
        return {
            functions: Object.assign(Object.assign({}, is.functions), decode.functions),
            statements: [
                ...is.statements,
                ...decode.statements,
                StatementFactory_1.StatementFactory.constant({
                    name: "__is",
                    value: is.arrow,
                }),
                StatementFactory_1.StatementFactory.constant({
                    name: "__decode",
                    value: decode.arrow,
                }),
            ],
            arrow: typescript_1.default.factory.createArrowFunction(undefined, undefined, decode.arrow.parameters, typescript_1.default.factory.createUnionTypeNode([
                (_a = decode.arrow.type) !== null && _a !== void 0 ? _a : TypeFactory_1.TypeFactory.keyword("any"),
                typescript_1.default.factory.createTypeReferenceNode("null"),
            ]), undefined, typescript_1.default.factory.createBlock([
                StatementFactory_1.StatementFactory.constant({
                    name: "value",
                    value: typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createIdentifier("__decode"), undefined, [typescript_1.default.factory.createIdentifier("input")]),
                }),
                typescript_1.default.factory.createIfStatement(typescript_1.default.factory.createPrefixUnaryExpression(typescript_1.default.SyntaxKind.ExclamationToken, typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createIdentifier("__is"), undefined, [typescript_1.default.factory.createIdentifier("value")])), typescript_1.default.factory.createReturnStatement(typescript_1.default.factory.createNull())),
                typescript_1.default.factory.createReturnStatement(typescript_1.default.factory.createIdentifier("value")),
            ], true)),
        };
    };
    ProtobufIsDecodeProgrammer.write = (props) => {
        const functor = new FunctionProgrammer_1.FunctionProgrammer(props.modulo.getText());
        const result = ProtobufIsDecodeProgrammer.decompose(Object.assign(Object.assign({}, props), { functor }));
        return FeatureProgrammer_1.FeatureProgrammer.writeDecomposed({
            modulo: props.modulo,
            functor,
            result,
        });
    };
})(ProtobufIsDecodeProgrammer || (exports.ProtobufIsDecodeProgrammer = ProtobufIsDecodeProgrammer = {}));
//# sourceMappingURL=ProtobufIsDecodeProgrammer.js.map