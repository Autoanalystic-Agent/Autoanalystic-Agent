import ts from 'typescript';
import { ExpressionFactory } from '../../factories/ExpressionFactory.mjs';
import { StatementFactory } from '../../factories/StatementFactory.mjs';
import { TypeFactory } from '../../factories/TypeFactory.mjs';
import { AssertProgrammer } from '../AssertProgrammer.mjs';
import { FunctionalAssertFunctionProgrammer } from './FunctionalAssertFunctionProgrammer.mjs';
import { FunctionalGeneralProgrammer } from './internal/FunctionalGeneralProgrammer.mjs';

var FunctionalAssertParametersProgrammer;
(function (FunctionalAssertParametersProgrammer) {
    FunctionalAssertParametersProgrammer.write = (props) => {
        const wrapper = FunctionalAssertFunctionProgrammer.errorFactoryWrapper({
            context: props.context,
            parameters: props.declaration.parameters,
            init: props.init,
        });
        const { async } = FunctionalGeneralProgrammer.getReturnType({
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
        return ExpressionFactory.selfCall(ts.factory.createBlock([
            wrapper.variable,
            ...result.functions,
            ts.factory.createReturnStatement(ts.factory.createArrowFunction(async
                ? [ts.factory.createModifier(ts.SyntaxKind.AsyncKeyword)]
                : undefined, undefined, props.declaration.parameters, props.declaration.type, undefined, ts.factory.createBlock([
                ...result.expressions.map(ts.factory.createExpressionStatement),
                ts.factory.createReturnStatement(ts.factory.createCallExpression(props.expression, undefined, props.declaration.parameters.map((p) => ts.factory.createIdentifier(p.name.getText())))),
            ], true))),
        ], true));
    };
    FunctionalAssertParametersProgrammer.decompose = (props) => ({
        functions: props.parameters.map((p, i) => StatementFactory.constant({
            name: `__assert_param_${i}`,
            value: AssertProgrammer.write({
                context: props.context,
                modulo: props.modulo,
                config: {
                    equals: props.config.equals,
                    guard: false,
                },
                type: p.type
                    ? props.context.checker.getTypeFromTypeNode(p.type)
                    : props.context.checker.getTypeFromTypeNode(TypeFactory.keyword("any")),
                name: undefined,
                init: FunctionalAssertFunctionProgrammer.hookPath({
                    wrapper: props.wrapper,
                    replacer: `$input.parameters[${i}]`,
                }),
            }),
        })),
        expressions: props.parameters.map((p, i) => ts.factory.createCallExpression(ts.factory.createIdentifier(`__assert_param_${i}`), undefined, [ts.factory.createIdentifier(p.name.getText())])),
    });
})(FunctionalAssertParametersProgrammer || (FunctionalAssertParametersProgrammer = {}));

export { FunctionalAssertParametersProgrammer };
//# sourceMappingURL=FunctionalAssertParametersProgrammer.mjs.map
