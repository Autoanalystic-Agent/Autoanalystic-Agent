"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunctionalIsParametersProgrammer = void 0;
const typescript_1 = __importDefault(require("typescript"));
const ExpressionFactory_1 = require("../../factories/ExpressionFactory");
const StatementFactory_1 = require("../../factories/StatementFactory");
const TypeFactory_1 = require("../../factories/TypeFactory");
const IsProgrammer_1 = require("../IsProgrammer");
const FunctionalIsFunctionProgrammer_1 = require("./FunctionalIsFunctionProgrammer");
const FunctionalGeneralProgrammer_1 = require("./internal/FunctionalGeneralProgrammer");
var FunctionalIsParametersProgrammer;
(function (FunctionalIsParametersProgrammer) {
    FunctionalIsParametersProgrammer.write = (props) => {
        const { async } = FunctionalGeneralProgrammer_1.FunctionalGeneralProgrammer.getReturnType({
            checker: props.context.checker,
            declaration: props.declaration,
        });
        const result = FunctionalIsParametersProgrammer.decompose(props);
        return ExpressionFactory_1.ExpressionFactory.selfCall(typescript_1.default.factory.createBlock([
            ...result.functions,
            typescript_1.default.factory.createReturnStatement(typescript_1.default.factory.createArrowFunction(async
                ? [typescript_1.default.factory.createModifier(typescript_1.default.SyntaxKind.AsyncKeyword)]
                : undefined, undefined, props.declaration.parameters, FunctionalIsFunctionProgrammer_1.FunctionalIsFunctionProgrammer.getReturnTypeNode({
                declaration: props.declaration,
                async,
            }), undefined, typescript_1.default.factory.createBlock([
                ...result.statements,
                typescript_1.default.factory.createReturnStatement(typescript_1.default.factory.createCallExpression(props.expression, undefined, props.declaration.parameters.map((p) => typescript_1.default.factory.createIdentifier(p.name.getText())))),
            ], true))),
        ], true));
    };
    FunctionalIsParametersProgrammer.decompose = (props) => ({
        functions: props.declaration.parameters.map((p, i) => {
            var _a;
            return StatementFactory_1.StatementFactory.constant({
                name: `__is_param_${i}`,
                value: IsProgrammer_1.IsProgrammer.write({
                    context: props.context,
                    modulo: props.modulo,
                    config: props.config,
                    type: props.context.checker.getTypeFromTypeNode((_a = p.type) !== null && _a !== void 0 ? _a : TypeFactory_1.TypeFactory.keyword("any")),
                    init: undefined,
                    name: undefined,
                }),
            });
        }),
        statements: props.declaration.parameters
            .map((p, i) => [
            typescript_1.default.factory.createIfStatement(typescript_1.default.factory.createStrictEquality(typescript_1.default.factory.createFalse(), typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createIdentifier(`__is_param_${i}`), undefined, [typescript_1.default.factory.createIdentifier(p.name.getText())])), typescript_1.default.factory.createReturnStatement(typescript_1.default.factory.createNull())),
        ])
            .flat(),
    });
})(FunctionalIsParametersProgrammer || (exports.FunctionalIsParametersProgrammer = FunctionalIsParametersProgrammer = {}));
//# sourceMappingURL=FunctionalIsParametersProgrammer.js.map