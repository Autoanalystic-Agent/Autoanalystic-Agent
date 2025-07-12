"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunctionAssertReturnProgrammer = void 0;
const typescript_1 = __importDefault(require("typescript"));
const ExpressionFactory_1 = require("../../factories/ExpressionFactory");
const StatementFactory_1 = require("../../factories/StatementFactory");
const AssertProgrammer_1 = require("../AssertProgrammer");
const FunctionalAssertFunctionProgrammer_1 = require("./FunctionalAssertFunctionProgrammer");
const FunctionalGeneralProgrammer_1 = require("./internal/FunctionalGeneralProgrammer");
var FunctionAssertReturnProgrammer;
(function (FunctionAssertReturnProgrammer) {
    FunctionAssertReturnProgrammer.write = (props) => {
        const wrapper = FunctionalAssertFunctionProgrammer_1.FunctionalAssertFunctionProgrammer.errorFactoryWrapper({
            context: props.context,
            parameters: props.declaration.parameters,
            init: props.init,
        });
        const result = FunctionAssertReturnProgrammer.decompose({
            context: props.context,
            modulo: props.modulo,
            config: props.config,
            expression: props.expression,
            declaration: props.declaration,
            wrapper: wrapper.name,
        });
        return ExpressionFactory_1.ExpressionFactory.selfCall(typescript_1.default.factory.createBlock([
            wrapper.variable,
            ...result.functions,
            typescript_1.default.factory.createReturnStatement(typescript_1.default.factory.createArrowFunction(result.async
                ? [typescript_1.default.factory.createModifier(typescript_1.default.SyntaxKind.AsyncKeyword)]
                : undefined, undefined, props.declaration.parameters, props.declaration.type, undefined, result.value)),
        ], true));
    };
    FunctionAssertReturnProgrammer.decompose = (props) => {
        const { type, async } = FunctionalGeneralProgrammer_1.FunctionalGeneralProgrammer.getReturnType({
            checker: props.context.checker,
            declaration: props.declaration,
        });
        const caller = typescript_1.default.factory.createCallExpression(props.expression, undefined, props.declaration.parameters.map((p) => typescript_1.default.factory.createIdentifier(p.name.getText())));
        return {
            async,
            functions: [
                StatementFactory_1.StatementFactory.constant({
                    name: "__assert_return",
                    value: AssertProgrammer_1.AssertProgrammer.write({
                        context: props.context,
                        modulo: props.modulo,
                        config: {
                            equals: props.config.equals,
                            guard: false,
                        },
                        type,
                        name: undefined,
                        init: FunctionalAssertFunctionProgrammer_1.FunctionalAssertFunctionProgrammer.hookPath({
                            wrapper: props.wrapper,
                            replacer: "$input.return",
                        }),
                    }),
                }),
            ],
            value: typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createIdentifier("__assert_return"), undefined, [async ? typescript_1.default.factory.createAwaitExpression(caller) : caller]),
        };
    };
})(FunctionAssertReturnProgrammer || (exports.FunctionAssertReturnProgrammer = FunctionAssertReturnProgrammer = {}));
//# sourceMappingURL=FunctionalAssertReturnProgrammer.js.map