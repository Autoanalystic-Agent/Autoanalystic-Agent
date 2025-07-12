"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunctionalValidateParametersProgrammer = void 0;
const typescript_1 = __importDefault(require("typescript"));
const ExpressionFactory_1 = require("../../factories/ExpressionFactory");
const IdentifierFactory_1 = require("../../factories/IdentifierFactory");
const StatementFactory_1 = require("../../factories/StatementFactory");
const TypeFactory_1 = require("../../factories/TypeFactory");
const StringUtil_1 = require("../../utils/StringUtil");
const ValidateProgrammer_1 = require("../ValidateProgrammer");
const FunctionalValidateFunctionProgrammer_1 = require("./FunctionalValidateFunctionProgrammer");
const FunctionalGeneralProgrammer_1 = require("./internal/FunctionalGeneralProgrammer");
var FunctionalValidateParametersProgrammer;
(function (FunctionalValidateParametersProgrammer) {
    FunctionalValidateParametersProgrammer.write = (props) => {
        const { async } = FunctionalGeneralProgrammer_1.FunctionalGeneralProgrammer.getReturnType({
            checker: props.context.checker,
            declaration: props.declaration,
        });
        const result = FunctionalValidateParametersProgrammer.decompose(props);
        const caller = typescript_1.default.factory.createCallExpression(props.expression, undefined, props.declaration.parameters.map((p) => typescript_1.default.factory.createIdentifier(p.name.getText())));
        return ExpressionFactory_1.ExpressionFactory.selfCall(typescript_1.default.factory.createBlock([
            ...result.functions,
            typescript_1.default.factory.createReturnStatement(typescript_1.default.factory.createArrowFunction(async
                ? [typescript_1.default.factory.createModifier(typescript_1.default.SyntaxKind.AsyncKeyword)]
                : undefined, undefined, props.declaration.parameters, FunctionalValidateFunctionProgrammer_1.FunctionalValidateFunctionProgrammer.getReturnTypeNode({
                context: props.context,
                declaration: props.declaration,
                async,
            }), undefined, typescript_1.default.factory.createBlock([
                ...result.statements,
                typescript_1.default.factory.createReturnStatement(typescript_1.default.factory.createObjectLiteralExpression([
                    typescript_1.default.factory.createPropertyAssignment("success", typescript_1.default.factory.createTrue()),
                    typescript_1.default.factory.createPropertyAssignment("data", async
                        ? typescript_1.default.factory.createAwaitExpression(caller)
                        : caller),
                    typescript_1.default.factory.createPropertyAssignment("errors", typescript_1.default.factory.createArrayLiteralExpression([])),
                ], true)),
            ], true))),
        ], true));
    };
    FunctionalValidateParametersProgrammer.decompose = (props) => {
        const resultName = StringUtil_1.StringUtil.escapeDuplicate({
            keep: props.declaration.parameters.map((p) => p.name.getText()),
            input: "paramErrorResults",
        });
        const validationResultArray = typescript_1.default.factory.createArrayLiteralExpression(props.declaration.parameters.map((p, i) => typescript_1.default.factory.createAsExpression(typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createIdentifier(`__validate_param_${i}`), undefined, [typescript_1.default.factory.createIdentifier(p.name.getText())]), props.context.importer.type({
            file: "typia",
            name: "IValidation.IFailure",
        }))), true);
        const errorMatrix = typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createPropertyAccessExpression(validationResultArray, "map"), undefined, [
            typescript_1.default.factory.createArrowFunction(undefined, undefined, [IdentifierFactory_1.IdentifierFactory.parameter("r"), IdentifierFactory_1.IdentifierFactory.parameter("i")], undefined, undefined, typescript_1.default.factory.createConditionalExpression(typescript_1.default.factory.createStrictEquality(typescript_1.default.factory.createTrue(), typescript_1.default.factory.createPropertyAccessExpression(typescript_1.default.factory.createIdentifier("r"), "success")), undefined, typescript_1.default.factory.createIdentifier("r"), undefined, typescript_1.default.factory.createObjectLiteralExpression([
                typescript_1.default.factory.createSpreadAssignment(typescript_1.default.factory.createIdentifier("r")),
                typescript_1.default.factory.createPropertyAssignment("errors", FunctionalValidateFunctionProgrammer_1.FunctionalValidateFunctionProgrammer.hookErrors({
                    expression: typescript_1.default.factory.createPropertyAccessExpression(typescript_1.default.factory.createIdentifier("r"), "errors"),
                    replacer: typescript_1.default.factory.createTemplateExpression(typescript_1.default.factory.createTemplateHead("$input.parameters["), [
                        typescript_1.default.factory.createTemplateSpan(typescript_1.default.factory.createIdentifier("i"), typescript_1.default.factory.createTemplateTail("]")),
                    ]),
                })),
            ], true))),
        ]);
        const failures = typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createPropertyAccessExpression(errorMatrix, "filter"), undefined, [
            typescript_1.default.factory.createArrowFunction(undefined, undefined, [IdentifierFactory_1.IdentifierFactory.parameter("r")], undefined, undefined, typescript_1.default.factory.createStrictEquality(typescript_1.default.factory.createFalse(), typescript_1.default.factory.createPropertyAccessExpression(typescript_1.default.factory.createIdentifier("r"), "success"))),
        ]);
        return {
            functions: props.declaration.parameters.map((p, i) => {
                var _a;
                return StatementFactory_1.StatementFactory.constant({
                    name: `__validate_param_${i}`,
                    value: ValidateProgrammer_1.ValidateProgrammer.write(Object.assign(Object.assign({}, props), { type: props.context.checker.getTypeFromTypeNode((_a = p.type) !== null && _a !== void 0 ? _a : TypeFactory_1.TypeFactory.keyword("any")), name: undefined, init: undefined })),
                });
            }),
            statements: [
                StatementFactory_1.StatementFactory.constant({
                    name: resultName,
                    value: failures,
                }),
                typescript_1.default.factory.createIfStatement(typescript_1.default.factory.createStrictInequality(typescript_1.default.factory.createNumericLiteral("0"), typescript_1.default.factory.createPropertyAccessExpression(typescript_1.default.factory.createIdentifier(resultName), "length")), typescript_1.default.factory.createReturnStatement(typescript_1.default.factory.createObjectLiteralExpression([
                    typescript_1.default.factory.createPropertyAssignment("success", typescript_1.default.factory.createFalse()),
                    typescript_1.default.factory.createPropertyAssignment("errors", typescript_1.default.factory.createCallExpression(IdentifierFactory_1.IdentifierFactory.access(typescript_1.default.factory.createCallExpression(IdentifierFactory_1.IdentifierFactory.access(typescript_1.default.factory.createIdentifier(resultName), "map"), undefined, [
                        typescript_1.default.factory.createArrowFunction(undefined, undefined, [
                            IdentifierFactory_1.IdentifierFactory.parameter("r", TypeFactory_1.TypeFactory.keyword("any")),
                        ], undefined, undefined, IdentifierFactory_1.IdentifierFactory.access(typescript_1.default.factory.createIdentifier("r"), "errors")),
                    ]), "flat"), undefined, undefined)),
                ], true))),
            ],
        };
    };
})(FunctionalValidateParametersProgrammer || (exports.FunctionalValidateParametersProgrammer = FunctionalValidateParametersProgrammer = {}));
//# sourceMappingURL=FunctionalValidateParametersProgrammer.js.map