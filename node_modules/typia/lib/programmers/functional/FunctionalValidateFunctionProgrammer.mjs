import ts from 'typescript';
import { ExpressionFactory } from '../../factories/ExpressionFactory.mjs';
import { IdentifierFactory } from '../../factories/IdentifierFactory.mjs';
import { FunctionalValidateParametersProgrammer } from './FunctionalValidateParametersProgrammer.mjs';
import { FunctionalValidateReturnProgrammer } from './FunctionalValidateReturnProgrammer.mjs';

var FunctionalValidateFunctionProgrammer;
(function (FunctionalValidateFunctionProgrammer) {
    FunctionalValidateFunctionProgrammer.write = (props) => {
        const p = FunctionalValidateParametersProgrammer.decompose(props);
        const r = FunctionalValidateReturnProgrammer.decompose(props);
        return ExpressionFactory.selfCall(ts.factory.createBlock([
            ...p.functions,
            ...r.functions,
            ts.factory.createReturnStatement(ts.factory.createArrowFunction(r.async
                ? [ts.factory.createModifier(ts.SyntaxKind.AsyncKeyword)]
                : undefined, undefined, props.declaration.parameters, FunctionalValidateFunctionProgrammer.getReturnTypeNode({
                context: props.context,
                declaration: props.declaration,
                async: r.async,
            }), undefined, ts.factory.createBlock([...p.statements, ...r.statements], true))),
        ], true));
    };
    FunctionalValidateFunctionProgrammer.hookErrors = (props) => ts.factory.createCallExpression(ts.factory.createPropertyAccessExpression(props.expression, "map"), undefined, [
        ts.factory.createArrowFunction(undefined, undefined, [IdentifierFactory.parameter("error")], undefined, undefined, ts.factory.createObjectLiteralExpression([
            ts.factory.createSpreadAssignment(ts.factory.createIdentifier("error")),
            ts.factory.createPropertyAssignment("path", ts.factory.createCallExpression(ts.factory.createPropertyAccessExpression(ts.factory.createPropertyAccessExpression(ts.factory.createIdentifier("error"), "path"), "replace"), undefined, [ts.factory.createStringLiteral("$input"), props.replacer])),
        ], true)),
    ]);
    FunctionalValidateFunctionProgrammer.getReturnTypeNode = (props) => props.declaration.type
        ? props.async
            ? !!props.declaration.type.typeArguments?.[0]
                ? ts.factory.createTypeReferenceNode("Promise", [
                    props.context.importer.type({
                        file: "typia",
                        name: "IValidation",
                        arguments: [
                            props.declaration.type
                                .typeArguments[0],
                        ],
                    }),
                ])
                : undefined
            : props.context.importer.type({
                file: "typia",
                name: "IValidation",
                arguments: [props.declaration.type],
            })
        : undefined;
})(FunctionalValidateFunctionProgrammer || (FunctionalValidateFunctionProgrammer = {}));

export { FunctionalValidateFunctionProgrammer };
//# sourceMappingURL=FunctionalValidateFunctionProgrammer.mjs.map
