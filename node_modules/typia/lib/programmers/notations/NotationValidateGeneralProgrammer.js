"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotationValidateGeneralProgrammer = void 0;
const typescript_1 = __importDefault(require("typescript"));
const IdentifierFactory_1 = require("../../factories/IdentifierFactory");
const StatementFactory_1 = require("../../factories/StatementFactory");
const TypeFactory_1 = require("../../factories/TypeFactory");
const FeatureProgrammer_1 = require("../FeatureProgrammer");
const ValidateProgrammer_1 = require("../ValidateProgrammer");
const FunctionProgrammer_1 = require("../helpers/FunctionProgrammer");
const NotationGeneralProgrammer_1 = require("./NotationGeneralProgrammer");
var NotationValidateGeneralProgrammer;
(function (NotationValidateGeneralProgrammer) {
    NotationValidateGeneralProgrammer.decompose = (props) => {
        var _a;
        const validate = ValidateProgrammer_1.ValidateProgrammer.decompose(Object.assign(Object.assign({}, props), { config: {
                equals: false,
            } }));
        const notation = NotationGeneralProgrammer_1.NotationGeneralProgrammer.decompose(Object.assign(Object.assign({}, props), { validated: true }));
        return {
            functions: Object.assign(Object.assign({}, validate.functions), notation.functions),
            statements: [
                ...validate.statements,
                ...notation.statements,
                StatementFactory_1.StatementFactory.constant({
                    name: "__validate",
                    value: validate.arrow,
                }),
                StatementFactory_1.StatementFactory.constant({
                    name: "__notation",
                    value: notation.arrow,
                }),
            ],
            arrow: typescript_1.default.factory.createArrowFunction(undefined, undefined, [IdentifierFactory_1.IdentifierFactory.parameter("input", TypeFactory_1.TypeFactory.keyword("any"))], props.context.importer.type({
                file: "typia",
                name: "IValidation",
                arguments: [(_a = notation.arrow.type) !== null && _a !== void 0 ? _a : TypeFactory_1.TypeFactory.keyword("any")],
            }), undefined, typescript_1.default.factory.createBlock([
                StatementFactory_1.StatementFactory.constant({
                    name: "result",
                    value: typescript_1.default.factory.createAsExpression(typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createIdentifier("__validate"), undefined, [typescript_1.default.factory.createIdentifier("input")]), TypeFactory_1.TypeFactory.keyword("any")),
                }),
                typescript_1.default.factory.createIfStatement(typescript_1.default.factory.createIdentifier("result.success"), typescript_1.default.factory.createExpressionStatement(typescript_1.default.factory.createBinaryExpression(typescript_1.default.factory.createIdentifier("result.data"), typescript_1.default.SyntaxKind.EqualsToken, typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createIdentifier("__notation"), undefined, [typescript_1.default.factory.createIdentifier("input")])))),
                typescript_1.default.factory.createReturnStatement(typescript_1.default.factory.createAsExpression(typescript_1.default.factory.createIdentifier("result"), TypeFactory_1.TypeFactory.keyword("any"))),
            ], true)),
        };
    };
    NotationValidateGeneralProgrammer.write = (props) => {
        const functor = new FunctionProgrammer_1.FunctionProgrammer(props.modulo.getText());
        const result = NotationValidateGeneralProgrammer.decompose(Object.assign(Object.assign({}, props), { functor }));
        return FeatureProgrammer_1.FeatureProgrammer.writeDecomposed({
            modulo: props.modulo,
            functor,
            result,
        });
    };
})(NotationValidateGeneralProgrammer || (exports.NotationValidateGeneralProgrammer = NotationValidateGeneralProgrammer = {}));
//# sourceMappingURL=NotationValidateGeneralProgrammer.js.map