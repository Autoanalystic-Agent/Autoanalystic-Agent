"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiscAssertCloneProgrammer = void 0;
const typescript_1 = __importDefault(require("typescript"));
const IdentifierFactory_1 = require("../../factories/IdentifierFactory");
const StatementFactory_1 = require("../../factories/StatementFactory");
const TypeFactory_1 = require("../../factories/TypeFactory");
const AssertProgrammer_1 = require("../AssertProgrammer");
const FeatureProgrammer_1 = require("../FeatureProgrammer");
const FunctionProgrammer_1 = require("../helpers/FunctionProgrammer");
const MiscCloneProgrammer_1 = require("./MiscCloneProgrammer");
var MiscAssertCloneProgrammer;
(function (MiscAssertCloneProgrammer) {
    MiscAssertCloneProgrammer.decompose = (props) => {
        const assert = AssertProgrammer_1.AssertProgrammer.decompose(Object.assign(Object.assign({}, props), { config: {
                equals: false,
                guard: false,
            } }));
        const clone = MiscCloneProgrammer_1.MiscCloneProgrammer.decompose(Object.assign(Object.assign({}, props), { validated: true }));
        return {
            functions: Object.assign(Object.assign({}, assert.functions), clone.functions),
            statements: [
                ...assert.statements,
                ...clone.statements,
                StatementFactory_1.StatementFactory.constant({
                    name: "__assert",
                    value: assert.arrow,
                }),
                StatementFactory_1.StatementFactory.constant({
                    name: "__clone",
                    value: clone.arrow,
                }),
            ],
            arrow: typescript_1.default.factory.createArrowFunction(undefined, undefined, [
                IdentifierFactory_1.IdentifierFactory.parameter("input", TypeFactory_1.TypeFactory.keyword("any")),
                AssertProgrammer_1.AssertProgrammer.Guardian.parameter({
                    context: props.context,
                    init: props.init,
                }),
            ], clone.arrow.type, undefined, typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createIdentifier("__clone"), undefined, [
                typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createIdentifier("__assert"), undefined, [
                    typescript_1.default.factory.createIdentifier("input"),
                    AssertProgrammer_1.AssertProgrammer.Guardian.identifier(),
                ]),
            ])),
        };
    };
    MiscAssertCloneProgrammer.write = (props) => {
        const functor = new FunctionProgrammer_1.FunctionProgrammer(props.modulo.getText());
        const result = MiscAssertCloneProgrammer.decompose(Object.assign(Object.assign({}, props), { functor }));
        return FeatureProgrammer_1.FeatureProgrammer.writeDecomposed({
            modulo: props.modulo,
            functor,
            result,
        });
    };
})(MiscAssertCloneProgrammer || (exports.MiscAssertCloneProgrammer = MiscAssertCloneProgrammer = {}));
//# sourceMappingURL=MiscAssertCloneProgrammer.js.map