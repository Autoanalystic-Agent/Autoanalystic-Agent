"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotationIsGeneralProgrammer = void 0;
const typescript_1 = __importDefault(require("typescript"));
const IdentifierFactory_1 = require("../../factories/IdentifierFactory");
const StatementFactory_1 = require("../../factories/StatementFactory");
const TypeFactory_1 = require("../../factories/TypeFactory");
const FeatureProgrammer_1 = require("../FeatureProgrammer");
const IsProgrammer_1 = require("../IsProgrammer");
const FunctionProgrammer_1 = require("../helpers/FunctionProgrammer");
const NotationGeneralProgrammer_1 = require("./NotationGeneralProgrammer");
var NotationIsGeneralProgrammer;
(function (NotationIsGeneralProgrammer) {
    NotationIsGeneralProgrammer.decompose = (props) => {
        var _a;
        const is = IsProgrammer_1.IsProgrammer.decompose(Object.assign(Object.assign({}, props), { config: {
                equals: false,
            } }));
        const notation = NotationGeneralProgrammer_1.NotationGeneralProgrammer.decompose(Object.assign(Object.assign({}, props), { validated: true }));
        return {
            functions: Object.assign(Object.assign({}, is.functions), notation.functions),
            statements: [
                ...is.statements,
                ...notation.statements,
                StatementFactory_1.StatementFactory.constant({
                    name: "__is",
                    value: is.arrow,
                }),
                StatementFactory_1.StatementFactory.constant({
                    name: "__notation",
                    value: notation.arrow,
                }),
            ],
            arrow: typescript_1.default.factory.createArrowFunction(undefined, undefined, [IdentifierFactory_1.IdentifierFactory.parameter("input", TypeFactory_1.TypeFactory.keyword("any"))], typescript_1.default.factory.createUnionTypeNode([
                (_a = notation.arrow.type) !== null && _a !== void 0 ? _a : TypeFactory_1.TypeFactory.keyword("any"),
                typescript_1.default.factory.createTypeReferenceNode("null"),
            ]), undefined, typescript_1.default.factory.createBlock([
                typescript_1.default.factory.createIfStatement(typescript_1.default.factory.createPrefixUnaryExpression(typescript_1.default.SyntaxKind.ExclamationToken, typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createIdentifier("__is"), undefined, [typescript_1.default.factory.createIdentifier("input")])), typescript_1.default.factory.createReturnStatement(typescript_1.default.factory.createNull())),
                typescript_1.default.factory.createReturnStatement(typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createIdentifier("__notation"), undefined, [typescript_1.default.factory.createIdentifier("input")])),
            ], true)),
        };
    };
    NotationIsGeneralProgrammer.write = (props) => {
        const functor = new FunctionProgrammer_1.FunctionProgrammer(props.modulo.getText());
        const result = NotationIsGeneralProgrammer.decompose(Object.assign(Object.assign({}, props), { functor }));
        return FeatureProgrammer_1.FeatureProgrammer.writeDecomposed({
            modulo: props.modulo,
            functor,
            result,
        });
    };
})(NotationIsGeneralProgrammer || (exports.NotationIsGeneralProgrammer = NotationIsGeneralProgrammer = {}));
//# sourceMappingURL=NotationIsGeneralProgrammer.js.map