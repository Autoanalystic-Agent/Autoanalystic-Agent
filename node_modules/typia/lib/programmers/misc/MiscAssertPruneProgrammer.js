"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiscAssertPruneProgrammer = void 0;
const typescript_1 = __importDefault(require("typescript"));
const IdentifierFactory_1 = require("../../factories/IdentifierFactory");
const StatementFactory_1 = require("../../factories/StatementFactory");
const TypeFactory_1 = require("../../factories/TypeFactory");
const AssertProgrammer_1 = require("../AssertProgrammer");
const FeatureProgrammer_1 = require("../FeatureProgrammer");
const FunctionProgrammer_1 = require("../helpers/FunctionProgrammer");
const MiscPruneProgrammer_1 = require("./MiscPruneProgrammer");
var MiscAssertPruneProgrammer;
(function (MiscAssertPruneProgrammer) {
    MiscAssertPruneProgrammer.decompose = (props) => {
        var _a;
        const assert = AssertProgrammer_1.AssertProgrammer.decompose(Object.assign(Object.assign({}, props), { config: {
                equals: false,
                guard: false,
            } }));
        const prune = MiscPruneProgrammer_1.MiscPruneProgrammer.decompose(Object.assign(Object.assign({}, props), { validated: true }));
        return {
            functions: Object.assign(Object.assign({}, assert.functions), prune.functions),
            statements: [
                ...assert.statements,
                ...prune.statements,
                StatementFactory_1.StatementFactory.constant({
                    name: "__assert",
                    value: assert.arrow,
                }),
                StatementFactory_1.StatementFactory.constant({
                    name: "__prune",
                    value: prune.arrow,
                }),
            ],
            arrow: typescript_1.default.factory.createArrowFunction(undefined, undefined, [
                IdentifierFactory_1.IdentifierFactory.parameter("input", TypeFactory_1.TypeFactory.keyword("any")),
                AssertProgrammer_1.AssertProgrammer.Guardian.parameter({
                    context: props.context,
                    init: props.init,
                }),
            ], typescript_1.default.factory.createTypeReferenceNode((_a = props.name) !== null && _a !== void 0 ? _a : TypeFactory_1.TypeFactory.getFullName({
                checker: props.context.checker,
                type: props.type,
            })), undefined, typescript_1.default.factory.createBlock([
                typescript_1.default.factory.createExpressionStatement(typescript_1.default.factory.createBinaryExpression(typescript_1.default.factory.createIdentifier("input"), typescript_1.default.SyntaxKind.EqualsToken, typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createIdentifier("__assert"), undefined, [
                    typescript_1.default.factory.createIdentifier("input"),
                    AssertProgrammer_1.AssertProgrammer.Guardian.identifier(),
                ]))),
                typescript_1.default.factory.createExpressionStatement(typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createIdentifier("__prune"), undefined, [typescript_1.default.factory.createIdentifier("input")])),
                typescript_1.default.factory.createReturnStatement(typescript_1.default.factory.createIdentifier("input")),
            ], true)),
        };
    };
    MiscAssertPruneProgrammer.write = (props) => {
        const functor = new FunctionProgrammer_1.FunctionProgrammer(props.modulo.getText());
        const result = MiscAssertPruneProgrammer.decompose(Object.assign(Object.assign({}, props), { functor }));
        return FeatureProgrammer_1.FeatureProgrammer.writeDecomposed({
            modulo: props.modulo,
            functor,
            result,
        });
    };
})(MiscAssertPruneProgrammer || (exports.MiscAssertPruneProgrammer = MiscAssertPruneProgrammer = {}));
//# sourceMappingURL=MiscAssertPruneProgrammer.js.map