"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunctionalAssertParametersProgrammer = void 0;
const typescript_1 = __importDefault(require("typescript"));
const ExpressionFactory_1 = require("../../factories/ExpressionFactory");
const StatementFactory_1 = require("../../factories/StatementFactory");
const TypeFactory_1 = require("../../factories/TypeFactory");
const AssertProgrammer_1 = require("../AssertProgrammer");
const FunctionalAssertFunctionProgrammer_1 = require("./FunctionalAssertFunctionProgrammer");
const FunctionalGeneralProgrammer_1 = require("./internal/FunctionalGeneralProgrammer");
var FunctionalAssertParametersProgrammer;
(function (FunctionalAssertParametersProgrammer) {
    FunctionalAssertParametersProgrammer.write = (props) => {
        const wrapper = FunctionalAssertFunctionProgrammer_1.FunctionalAssertFunctionProgrammer.errorFactoryWrapper({
            context: props.context,
            parameters: props.declaration.parameters,
            init: props.init,
        });
        const { async } = FunctionalGeneralProgrammer_1.FunctionalGeneralProgrammer.getReturnType({
            checker: props.context.checker,
            declaration: props.declaration,
        });
        const result = FunctionalAssertParametersProgrammer.decompose({
            context: props.context,
            modulo: props.modulo,
            config: props.config,
            parameters: props.declaration.parameters,
            wrapper: wrapper.name,
        });
        return ExpressionFactory_1.ExpressionFactory.selfCall(typescript_1.default.factory.createBlock([
            wrapper.variable,
            ...result.functions,
            typescript_1.default.factory.createReturnStatement(typescript_1.default.factory.createArrowFunction(async
                ? [typescript_1.default.factory.createModifier(typescript_1.default.SyntaxKind.AsyncKeyword)]
                : undefined, undefined, props.declaration.parameters, props.declaration.type, undefined, typescript_1.default.factory.createBlock([
                ...result.expressions.map(typescript_1.default.factory.createExpressionStatement),
                typescript_1.default.factory.createReturnStatement(typescript_1.default.factory.createCallExpression(props.expression, undefined, props.declaration.parameters.map((p) => typescript_1.default.factory.createIdentifier(p.name.getText())))),
            ], true))),
        ], true));
    };
    FunctionalAssertParametersProgrammer.decompose = (props) => ({
        functions: props.parameters.map((p, i) => StatementFactory_1.StatementFactory.constant({
            name: `__assert_param_${i}`,
            value: AssertProgrammer_1.AssertProgrammer.write({
                context: props.context,
                modulo: props.modulo,
                config: {
                    equals: props.config.equals,
                    guard: false,
                },
                type: p.type
                    ? props.context.checker.getTypeFromTypeNode(p.type)
                    : props.context.checker.getTypeFromTypeNode(TypeFactory_1.TypeFactory.keyword("any")),
                name: undefined,
                init: FunctionalAssertFunctionProgrammer_1.FunctionalAssertFunctionProgrammer.hookPath({
                    wrapper: props.wrapper,
                    replacer: `$input.parameters[${i}]`,
                }),
            }),
        })),
        expressions: props.parameters.map((p, i) => typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createIdentifier(`__assert_param_${i}`), undefined, [typescript_1.default.factory.createIdentifier(p.name.getText())])),
    });
})(FunctionalAssertParametersProgrammer || (exports.FunctionalAssertParametersProgrammer = FunctionalAssertParametersProgrammer = {}));
//# sourceMappingURL=FunctionalAssertParametersProgrammer.js.map