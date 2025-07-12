"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunctionalIsReturnProgrammer = void 0;
const typescript_1 = __importDefault(require("typescript"));
const ExpressionFactory_1 = require("../../factories/ExpressionFactory");
const StatementFactory_1 = require("../../factories/StatementFactory");
const StringUtil_1 = require("../../utils/StringUtil");
const IsProgrammer_1 = require("../IsProgrammer");
const FunctionalIsFunctionProgrammer_1 = require("./FunctionalIsFunctionProgrammer");
const FunctionalGeneralProgrammer_1 = require("./internal/FunctionalGeneralProgrammer");
var FunctionalIsReturnProgrammer;
(function (FunctionalIsReturnProgrammer) {
    FunctionalIsReturnProgrammer.write = (props) => {
        const result = FunctionalIsReturnProgrammer.decompose(props);
        return ExpressionFactory_1.ExpressionFactory.selfCall(typescript_1.default.factory.createBlock([
            ...result.functions,
            typescript_1.default.factory.createReturnStatement(typescript_1.default.factory.createArrowFunction(result.async
                ? [typescript_1.default.factory.createModifier(typescript_1.default.SyntaxKind.AsyncKeyword)]
                : undefined, undefined, props.declaration.parameters, FunctionalIsFunctionProgrammer_1.FunctionalIsFunctionProgrammer.getReturnTypeNode({
                declaration: props.declaration,
                async: result.async,
            }), undefined, typescript_1.default.factory.createBlock(result.statements, true))),
        ], true));
    };
    FunctionalIsReturnProgrammer.decompose = (props) => {
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
                    name: "__is_return",
                    value: IsProgrammer_1.IsProgrammer.write(Object.assign(Object.assign({}, props), { type, name: undefined, init: undefined })),
                }),
            ],
            statements: [
                StatementFactory_1.StatementFactory.constant({
                    name,
                    value: async ? typescript_1.default.factory.createAwaitExpression(caller) : caller,
                }),
                typescript_1.default.factory.createReturnStatement(typescript_1.default.factory.createConditionalExpression(typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createIdentifier("__is_return"), undefined, [typescript_1.default.factory.createIdentifier(name)]), undefined, typescript_1.default.factory.createIdentifier(name), undefined, typescript_1.default.factory.createNull())),
            ],
        };
    };
})(FunctionalIsReturnProgrammer || (exports.FunctionalIsReturnProgrammer = FunctionalIsReturnProgrammer = {}));
//# sourceMappingURL=FunctionalIsReturnProgrammer.js.map