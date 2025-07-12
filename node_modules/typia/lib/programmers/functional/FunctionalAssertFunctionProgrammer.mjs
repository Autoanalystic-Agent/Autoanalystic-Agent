import ts from 'typescript';
import { ExpressionFactory } from '../../factories/ExpressionFactory.mjs';
import { IdentifierFactory } from '../../factories/IdentifierFactory.mjs';
import { StringUtil } from '../../utils/StringUtil.mjs';
import { AssertProgrammer } from '../AssertProgrammer.mjs';
import { FunctionalAssertParametersProgrammer } from './FunctionalAssertParametersProgrammer.mjs';
import { FunctionAssertReturnProgrammer } from './FunctionalAssertReturnProgrammer.mjs';

var FunctionalAssertFunctionProgrammer;
(function (FunctionalAssertFunctionProgrammer) {
    FunctionalAssertFunctionProgrammer.write = (props) => {
        const wrapper = FunctionalAssertFunctionProgrammer.errorFactoryWrapper({
            context: props.context,
            parameters: props.declaration.parameters,
            init: props.init,
        });
        const p = FunctionalAssertParametersProgrammer.decompose({
            context: props.context,
            modulo: props.modulo,
            config: props.config,
            parameters: props.declaration.parameters,
            wrapper: wrapper.name,
        });
        const r = FunctionAssertReturnProgrammer.decompose({
            context: props.context,
            modulo: props.modulo,
            config: props.config,
            expression: props.expression,
            declaration: props.declaration,
            wrapper: wrapper.name,
        });
        return ExpressionFactory.selfCall(ts.factory.createBlock([
            wrapper.variable,
            ...p.functions,
            ...r.functions,
            ts.factory.createReturnStatement(ts.factory.createArrowFunction(r.async
                ? [ts.factory.createModifier(ts.SyntaxKind.AsyncKeyword)]
                : undefined, undefined, props.declaration.parameters, props.declaration.type, undefined, ts.factory.createBlock([
                ...p.expressions.map(ts.factory.createExpressionStatement),
                ts.factory.createReturnStatement(r.value),
            ]))),
        ], true));
    };
    FunctionalAssertFunctionProgrammer.errorFactoryWrapper = (props) => {
        const name = StringUtil.escapeDuplicate({
            keep: props.parameters.map((p) => p.name.getText()),
            input: "errorFactoryWrapper",
        });
        const variable = ts.factory.createVariableStatement(undefined, ts.factory.createVariableDeclarationList([
            ts.factory.createVariableDeclaration(name, undefined, AssertProgrammer.Guardian.type(props.context), props.init ??
                props.context.importer.internal("functionalTypeGuardErrorFactory")),
        ], ts.NodeFlags.Const));
        return { name, variable };
    };
    FunctionalAssertFunctionProgrammer.hookPath = (props) => ts.factory.createArrowFunction(undefined, undefined, [IdentifierFactory.parameter("p")], undefined, undefined, ts.factory.createCallExpression(ts.factory.createIdentifier(props.wrapper), undefined, [
        ts.factory.createObjectLiteralExpression([
            ts.factory.createSpreadAssignment(ts.factory.createIdentifier("p")),
            ts.factory.createPropertyAssignment("path", ts.factory.createConditionalExpression(ts.factory.createPropertyAccessExpression(ts.factory.createIdentifier("p"), "path"), undefined, ts.factory.createCallExpression(ts.factory.createPropertyAccessExpression(ts.factory.createPropertyAccessExpression(ts.factory.createIdentifier("p"), "path"), "replace"), undefined, [
                ts.factory.createStringLiteral("$input"),
                ts.factory.createStringLiteral(props.replacer),
            ]), undefined, ts.factory.createIdentifier("undefined"))),
        ]),
    ]));
})(FunctionalAssertFunctionProgrammer || (FunctionalAssertFunctionProgrammer = {}));

export { FunctionalAssertFunctionProgrammer };
//# sourceMappingURL=FunctionalAssertFunctionProgrammer.mjs.map
