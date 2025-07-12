import ts from 'typescript';
import { ExpressionFactory } from '../../factories/ExpressionFactory.mjs';
import { StatementFactory } from '../../factories/StatementFactory.mjs';
import { StringUtil } from '../../utils/StringUtil.mjs';
import { ValidateProgrammer } from '../ValidateProgrammer.mjs';
import { FunctionalValidateFunctionProgrammer } from './FunctionalValidateFunctionProgrammer.mjs';
import { FunctionalGeneralProgrammer } from './internal/FunctionalGeneralProgrammer.mjs';

var FunctionalValidateReturnProgrammer;
(function (FunctionalValidateReturnProgrammer) {
    FunctionalValidateReturnProgrammer.write = (props) => {
        const result = FunctionalValidateReturnProgrammer.decompose(props);
        return ExpressionFactory.selfCall(ts.factory.createBlock([
            ...result.functions,
            ts.factory.createReturnStatement(ts.factory.createArrowFunction(result.async
                ? [ts.factory.createModifier(ts.SyntaxKind.AsyncKeyword)]
                : undefined, undefined, props.declaration.parameters, FunctionalValidateFunctionProgrammer.getReturnTypeNode({
                context: props.context,
                declaration: props.declaration,
                async: result.async,
            }), undefined, ts.factory.createBlock(result.statements, true))),
        ], true));
    };
    FunctionalValidateReturnProgrammer.decompose = (props) => {
        const { type, async } = FunctionalGeneralProgrammer.getReturnType({
            checker: props.context.checker,
            declaration: props.declaration,
        });
        const caller = ts.factory.createCallExpression(props.expression, undefined, props.declaration.parameters.map((p) => ts.factory.createIdentifier(p.name.getText())));
        const name = StringUtil.escapeDuplicate({
            keep: props.declaration.parameters.map((p) => p.name.getText()),
            input: "result",
        });
        return {
            async,
            functions: [
                StatementFactory.constant({
                    name: "__validate_return",
                    value: ValidateProgrammer.write({
                        ...props,
                        type,
                        name: undefined,
                        init: undefined,
                    }),
                }),
            ],
            statements: [
                StatementFactory.constant({
                    name,
                    value: ts.factory.createCallExpression(ts.factory.createIdentifier("__validate_return"), undefined, [async ? ts.factory.createAwaitExpression(caller) : caller]),
                }),
                ts.factory.createIfStatement(ts.factory.createStrictEquality(ts.factory.createFalse(), ts.factory.createPropertyAccessExpression(ts.factory.createIdentifier(name), ts.factory.createIdentifier("success"))), ts.factory.createExpressionStatement(ts.factory.createBinaryExpression(ts.factory.createPropertyAccessExpression(ts.factory.createIdentifier(name), ts.factory.createIdentifier("errors")), ts.factory.createToken(ts.SyntaxKind.EqualsToken), FunctionalValidateFunctionProgrammer.hookErrors({
                    expression: ts.factory.createPropertyAccessExpression(ts.factory.createIdentifier(name), ts.factory.createIdentifier("errors")),
                    replacer: ts.factory.createStringLiteral("$input.return"),
                })))),
                ts.factory.createReturnStatement(ts.factory.createIdentifier("result")),
            ],
        };
    };
})(FunctionalValidateReturnProgrammer || (FunctionalValidateReturnProgrammer = {}));

export { FunctionalValidateReturnProgrammer };
//# sourceMappingURL=FunctionalValidateReturnProgrammer.mjs.map
