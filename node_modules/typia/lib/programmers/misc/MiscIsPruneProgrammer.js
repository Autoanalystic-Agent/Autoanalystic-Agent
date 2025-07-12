"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiscIsPruneProgrammer = void 0;
const typescript_1 = __importDefault(require("typescript"));
const IdentifierFactory_1 = require("../../factories/IdentifierFactory");
const StatementFactory_1 = require("../../factories/StatementFactory");
const TypeFactory_1 = require("../../factories/TypeFactory");
const FeatureProgrammer_1 = require("../FeatureProgrammer");
const IsProgrammer_1 = require("../IsProgrammer");
const FunctionProgrammer_1 = require("../helpers/FunctionProgrammer");
const MiscPruneProgrammer_1 = require("./MiscPruneProgrammer");
var MiscIsPruneProgrammer;
(function (MiscIsPruneProgrammer) {
    MiscIsPruneProgrammer.decompose = (props) => {
        const is = IsProgrammer_1.IsProgrammer.decompose(Object.assign(Object.assign({}, props), { config: {
                equals: false,
            } }));
        const prune = MiscPruneProgrammer_1.MiscPruneProgrammer.decompose(Object.assign(Object.assign({}, props), { validated: true }));
        return {
            functions: Object.assign(Object.assign({}, is.functions), prune.functions),
            statements: [
                ...is.statements,
                ...prune.statements,
                StatementFactory_1.StatementFactory.constant({
                    name: "__is",
                    value: is.arrow,
                }),
                StatementFactory_1.StatementFactory.constant({
                    name: "__prune",
                    value: prune.arrow,
                }),
            ],
            arrow: typescript_1.default.factory.createArrowFunction(undefined, undefined, [IdentifierFactory_1.IdentifierFactory.parameter("input", TypeFactory_1.TypeFactory.keyword("any"))], is.arrow.type, undefined, typescript_1.default.factory.createBlock([
                typescript_1.default.factory.createIfStatement(typescript_1.default.factory.createEquality(typescript_1.default.factory.createFalse(), typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createIdentifier("__is"), undefined, [typescript_1.default.factory.createIdentifier("input")])), typescript_1.default.factory.createReturnStatement(typescript_1.default.factory.createFalse())),
                typescript_1.default.factory.createExpressionStatement(typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createIdentifier("__prune"), undefined, [typescript_1.default.factory.createIdentifier("input")])),
                typescript_1.default.factory.createReturnStatement(typescript_1.default.factory.createTrue()),
            ], true)),
        };
    };
    MiscIsPruneProgrammer.write = (props) => {
        const functor = new FunctionProgrammer_1.FunctionProgrammer(props.modulo.getText());
        const result = MiscIsPruneProgrammer.decompose(Object.assign(Object.assign({}, props), { functor }));
        return FeatureProgrammer_1.FeatureProgrammer.writeDecomposed({
            modulo: props.modulo,
            functor,
            result,
        });
    };
})(MiscIsPruneProgrammer || (exports.MiscIsPruneProgrammer = MiscIsPruneProgrammer = {}));
//# sourceMappingURL=MiscIsPruneProgrammer.js.map