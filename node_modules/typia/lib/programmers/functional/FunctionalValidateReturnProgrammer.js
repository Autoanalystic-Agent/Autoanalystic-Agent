"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunctionalValidateReturnProgrammer = void 0;
const typescript_1 = __importDefault(require("typescript"));
const ExpressionFactory_1 = require("../../factories/ExpressionFactory");
const StatementFactory_1 = require("../../factories/StatementFactory");
const StringUtil_1 = require("../../utils/StringUtil");
const ValidateProgrammer_1 = require("../ValidateProgrammer");
const FunctionalValidateFunctionProgrammer_1 = require("./FunctionalValidateFunctionProgrammer");
const FunctionalGeneralProgrammer_1 = require("./internal/FunctionalGeneralProgrammer");
var FunctionalValidateReturnProgrammer;
(function (FunctionalValidateReturnProgrammer) {
    FunctionalValidateReturnProgrammer.write = (props) => {
        const result = FunctionalValidateReturnProgrammer.decompose(props);
        return ExpressionFactory_1.ExpressionFactory.selfCall(typescript_1.default.factory.createBlock([
            ...result.functions,
            typescript_1.default.factory.createReturnStatement(typescript_1.default.factory.createArrowFunction(result.async
                ? [typescript_1.default.factory.createModifier(typescript_1.default.SyntaxKind.AsyncKeyword)]
                : undefined, undefined, props.declaration.parameters, FunctionalValidateFunctionProgrammer_1.FunctionalValidateFunctionProgrammer.getReturnTypeNode({
                context: props.context,
                declaration: props.declaration,
                async: result.async,
            }), undefined, typescript_1.default.factory.createBlock(result.statements, true))),
        ], true));
    };
    FunctionalValidateReturnProgrammer.decompose = (props) => {
        const { type, async } = FunctionalGeneralProgrammer_1.FunctionalGeneralProgrammer.getReturnType({
            checker: props.context.checker,
            declaration: props.declaration,
        });
        const caller = typescript_1.default.factory.createCallExpression(props.expression, undefined, props.declaration.parameters.map((p) => typescript_1.default.factory.createIdentifier(p.name.getText())));
        const name = StringUtil_1.StringUtil.escapeDuplicate({
            keep: props.declaration.parameters.map((p) => p.name.getText()),
            input: "result",
        });
        return {
            async,
            functions: [
                StatementFactory_1.StatementFactory.constant({
                    name: "__validate_return",
                    value: ValidateProgrammer_1.ValidateProgrammer.write(Object.assign(Object.assign({}, props), { type, name: undefined, init: undefined })),
                }),
            ],
            statements: [
                StatementFactory_1.StatementFactory.constant({
                    name,
                    value: typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createIdentifier("__validate_return"), undefined, [async ? typescript_1.default.factory.createAwaitExpression(caller) : caller]),
                }),
                typescript_1.default.factory.createIfStatement(typescript_1.default.factory.createStrictEquality(typescript_1.default.factory.createFalse(), typescript_1.default.factory.createPropertyAccessExpression(typescript_1.default.factory.createIdentifier(name), typescript_1.default.factory.createIdentifier("success"))), typescript_1.default.factory.createExpressionStatement(typescript_1.default.factory.createBinaryExpression(typescript_1.default.factory.createPropertyAccessExpression(typescript_1.default.factory.createIdentifier(name), typescript_1.default.factory.createIdentifier("errors")), typescript_1.default.factory.createToken(typescript_1.default.SyntaxKind.EqualsToken), FunctionalValidateFunctionProgrammer_1.FunctionalValidateFunctionProgrammer.hookErrors({
                    expression: typescript_1.default.factory.createPropertyAccessExpression(typescript_1.default.factory.createIdentifier(name), typescript_1.default.factory.createIdentifier("errors")),
                    replacer: typescript_1.default.factory.createStringLiteral("$input.return"),
                })))),
                typescript_1.default.factory.createReturnStatement(typescript_1.default.factory.createIdentifier("result")),
            ],
        };
    };
})(FunctionalValidateReturnProgrammer || (exports.FunctionalValidateReturnProgrammer = FunctionalValidateReturnProgrammer = {}));
//# sourceMappingURL=FunctionalValidateReturnProgrammer.js.map