import ts from 'typescript';
import { ExpressionFactory } from '../../factories/ExpressionFactory.mjs';
import { StatementFactory } from '../../factories/StatementFactory.mjs';
import { StringUtil } from '../../utils/StringUtil.mjs';
import { IsProgrammer } from '../IsProgrammer.mjs';
import { FunctionalIsFunctionProgrammer } from './FunctionalIsFunctionProgrammer.mjs';
import { FunctionalGeneralProgrammer } from './internal/FunctionalGeneralProgrammer.mjs';

var FunctionalIsReturnProgrammer;
(function (FunctionalIsReturnProgrammer) {
    FunctionalIsReturnProgrammer.write = (props) => {
        const result = FunctionalIsReturnProgrammer.decompose(props);
        return ExpressionFactory.selfCall(ts.factory.createBlock([
            ...result.functions,
            ts.factory.createReturnStatement(ts.factory.createArrowFunction(result.async
                ? [ts.factory.createModifier(ts.SyntaxKind.AsyncKeyword)]
                : undefined, undefined, props.declaration.parameters, FunctionalIsFunctionProgrammer.getReturnTypeNode({
                declaration: props.declaration,
                async: result.async,
            }), undefined, ts.factory.createBlock(result.statements, true))),
        ], true));
    };
    FunctionalIsReturnProgrammer.decompose = (props) => {
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
                    name: "__is_return",
                    value: IsProgrammer.write({
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
                    value: async ? ts.factory.createAwaitExpression(caller) : caller,
                }),
                ts.factory.createReturnStatement(ts.factory.createConditionalExpression(ts.factory.createCallExpression(ts.factory.createIdentifier("__is_return"), undefined, [ts.factory.createIdentifier(name)]), undefined, ts.factory.createIdentifier(name), undefined, ts.factory.createNull())),
            ],
        };
    };
})(FunctionalIsReturnProgrammer || (FunctionalIsReturnProgrammer = {}));

export { FunctionalIsReturnProgrammer };
//# sourceMappingURL=FunctionalIsReturnProgrammer.mjs.map
