import ts from 'typescript';
import { ExpressionFactory } from '../../factories/ExpressionFactory.mjs';
import { StatementFactory } from '../../factories/StatementFactory.mjs';
import { TypeFactory } from '../../factories/TypeFactory.mjs';
import { IsProgrammer } from '../IsProgrammer.mjs';
import { FunctionalIsFunctionProgrammer } from './FunctionalIsFunctionProgrammer.mjs';
import { FunctionalGeneralProgrammer } from './internal/FunctionalGeneralProgrammer.mjs';

var FunctionalIsParametersProgrammer;
(function (FunctionalIsParametersProgrammer) {
    FunctionalIsParametersProgrammer.write = (props) => {
        const { async } = FunctionalGeneralProgrammer.getReturnType({
            checker: props.context.checker,
            declaration: props.declaration,
        });
        const result = FunctionalIsParametersProgrammer.decompose(props);
        return ExpressionFactory.selfCall(ts.factory.createBlock([
            ...result.functions,
            ts.factory.createReturnStatement(ts.factory.createArrowFunction(async
                ? [ts.factory.createModifier(ts.SyntaxKind.AsyncKeyword)]
                : undefined, undefined, props.declaration.parameters, FunctionalIsFunctionProgrammer.getReturnTypeNode({
                declaration: props.declaration,
                async,
            }), undefined, ts.factory.createBlock([
                ...result.statements,
                ts.factory.createReturnStatement(ts.factory.createCallExpression(props.expression, undefined, props.declaration.parameters.map((p) => ts.factory.createIdentifier(p.name.getText())))),
            ], true))),
        ], true));
    };
    FunctionalIsParametersProgrammer.decompose = (props) => ({
        functions: props.declaration.parameters.map((p, i) => StatementFactory.constant({
            name: `__is_param_${i}`,
            value: IsProgrammer.write({
                context: props.context,
                modulo: props.modulo,
                config: props.config,
                type: props.context.checker.getTypeFromTypeNode(p.type ?? TypeFactory.keyword("any")),
                init: undefined,
                name: undefined,
            }),
        })),
        statements: props.declaration.parameters
            .map((p, i) => [
            ts.factory.createIfStatement(ts.factory.createStrictEquality(ts.factory.createFalse(), ts.factory.createCallExpression(ts.factory.createIdentifier(`__is_param_${i}`), undefined, [ts.factory.createIdentifier(p.name.getText())])), ts.factory.createReturnStatement(ts.factory.createNull())),
        ])
            .flat(),
    });
})(FunctionalIsParametersProgrammer || (FunctionalIsParametersProgrammer = {}));

export { FunctionalIsParametersProgrammer };
//# sourceMappingURL=FunctionalIsParametersProgrammer.mjs.map
