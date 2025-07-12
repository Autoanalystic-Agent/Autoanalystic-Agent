import ts from 'typescript';
import { ExpressionFactory } from '../../factories/ExpressionFactory.mjs';
import { StatementFactory } from '../../factories/StatementFactory.mjs';
import { AssertProgrammer } from '../AssertProgrammer.mjs';
import { FunctionalAssertFunctionProgrammer } from './FunctionalAssertFunctionProgrammer.mjs';
import { FunctionalGeneralProgrammer } from './internal/FunctionalGeneralProgrammer.mjs';

var FunctionAssertReturnProgrammer;
(function (FunctionAssertReturnProgrammer) {
    FunctionAssertReturnProgrammer.write = (props) => {
        const wrapper = FunctionalAssertFunctionProgrammer.errorFactoryWrapper({
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
        return ExpressionFactory.selfCall(ts.factory.createBlock([
            wrapper.variable,
            ...result.functions,
            ts.factory.createReturnStatement(ts.factory.createArrowFunction(result.async
                ? [ts.factory.createModifier(ts.SyntaxKind.AsyncKeyword)]
                : undefined, undefined, props.declaration.parameters, props.declaration.type, undefined, result.value)),
        ], true));
    };
    FunctionAssertReturnProgrammer.decompose = (props) => {
        const { type, async } = FunctionalGeneralProgrammer.getReturnType({
            checker: props.context.checker,
            declaration: props.declaration,
        });
        const caller = ts.factory.createCallExpression(props.expression, undefined, props.declaration.parameters.map((p) => ts.factory.createIdentifier(p.name.getText())));
        return {
            async,
            functions: [
                StatementFactory.constant({
                    name: "__assert_return",
                    value: AssertProgrammer.write({
                        context: props.context,
                        modulo: props.modulo,
                        config: {
                            equals: props.config.equals,
                            guard: false,
                        },
                        type,
                        name: undefined,
                        init: FunctionalAssertFunctionProgrammer.hookPath({
                            wrapper: props.wrapper,
                            replacer: "$input.return",
                        }),
                    }),
                }),
            ],
            value: ts.factory.createCallExpression(ts.factory.createIdentifier("__assert_return"), undefined, [async ? ts.factory.createAwaitExpression(caller) : caller]),
        };
    };
})(FunctionAssertReturnProgrammer || (FunctionAssertReturnProgrammer = {}));

export { FunctionAssertReturnProgrammer };
//# sourceMappingURL=FunctionalAssertReturnProgrammer.mjs.map
