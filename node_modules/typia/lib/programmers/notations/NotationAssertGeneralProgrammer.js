"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotationAssertGeneralProgrammer = void 0;
const typescript_1 = __importDefault(require("typescript"));
const IdentifierFactory_1 = require("../../factories/IdentifierFactory");
const StatementFactory_1 = require("../../factories/StatementFactory");
const TypeFactory_1 = require("../../factories/TypeFactory");
const AssertProgrammer_1 = require("../AssertProgrammer");
const FeatureProgrammer_1 = require("../FeatureProgrammer");
const FunctionProgrammer_1 = require("../helpers/FunctionProgrammer");
const NotationGeneralProgrammer_1 = require("./NotationGeneralProgrammer");
var NotationAssertGeneralProgrammer;
(function (NotationAssertGeneralProgrammer) {
    NotationAssertGeneralProgrammer.decompose = (props) => {
        const assert = AssertProgrammer_1.AssertProgrammer.decompose(Object.assign(Object.assign({}, props), { config: {
                equals: false,
                guard: false,
            } }));
        const notation = NotationGeneralProgrammer_1.NotationGeneralProgrammer.decompose(Object.assign(Object.assign({}, props), { validated: true }));
        return {
            functions: Object.assign(Object.assign({}, assert.functions), notation.functions),
            statements: [
                ...assert.statements,
                ...notation.statements,
                StatementFactory_1.StatementFactory.constant({
                    name: "__assert",
                    value: assert.arrow,
                }),
                StatementFactory_1.StatementFactory.constant({
                    name: "__notation",
                    value: notation.arrow,
                }),
            ],
            arrow: typescript_1.default.factory.createArrowFunction(undefined, undefined, [
                IdentifierFactory_1.IdentifierFactory.parameter("input", TypeFactory_1.TypeFactory.keyword("any")),
                AssertProgrammer_1.AssertProgrammer.Guardian.parameter({
                    context: props.context,
                    init: props.init,
                }),
            ], notation.arrow.type, undefined, typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createIdentifier("__notation"), undefined, [
                typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createIdentifier("__assert"), undefined, [
                    typescript_1.default.factory.createIdentifier("input"),
                    AssertProgrammer_1.AssertProgrammer.Guardian.identifier(),
                ]),
            ])),
        };
    };
    NotationAssertGeneralProgrammer.write = (props) => {
        const functor = new FunctionProgrammer_1.FunctionProgrammer(props.modulo.getText());
        const result = NotationAssertGeneralProgrammer.decompose(Object.assign(Object.assign({}, props), { functor }));
        return FeatureProgrammer_1.FeatureProgrammer.writeDecomposed({
            modulo: props.modulo,
            functor,
            result,
        });
    };
})(NotationAssertGeneralProgrammer || (exports.NotationAssertGeneralProgrammer = NotationAssertGeneralProgrammer = {}));
//# sourceMappingURL=NotationAssertGeneralProgrammer.js.map