import ts from 'typescript';
import { ExpressionFactory } from '../../factories/ExpressionFactory.mjs';
import { FunctionalIsParametersProgrammer } from './FunctionalIsParametersProgrammer.mjs';
import { FunctionalIsReturnProgrammer } from './FunctionalIsReturnProgrammer.mjs';

var FunctionalIsFunctionProgrammer;
(function (FunctionalIsFunctionProgrammer) {
    FunctionalIsFunctionProgrammer.write = (props) => {
        const p = FunctionalIsParametersProgrammer.decompose(props);
        const r = FunctionalIsReturnProgrammer.decompose(props);
        return ExpressionFactory.selfCall(ts.factory.createBlock([
            ...p.functions,
            ...r.functions,
            ts.factory.createReturnStatement(ts.factory.createArrowFunction(r.async
                ? [ts.factory.createModifier(ts.SyntaxKind.AsyncKeyword)]
                : undefined, undefined, props.declaration.parameters, FunctionalIsFunctionProgrammer.getReturnTypeNode({
                declaration: props.declaration,
                async: r.async,
            }), undefined, ts.factory.createBlock([...p.statements, ...r.statements], true))),
        ], true));
    };
    FunctionalIsFunctionProgrammer.getReturnTypeNode = (props) => props.declaration.type
        ? props.async
            ? !!props.declaration.type.typeArguments?.[0]
                ? ts.factory.createTypeReferenceNode("Promise", [
                    ts.factory.createUnionTypeNode([
                        props.declaration.type
                            .typeArguments[0],
                        ts.factory.createTypeReferenceNode("null"),
                    ]),
                ])
                : undefined
            : ts.factory.createUnionTypeNode([
                props.declaration.type,
                ts.factory.createTypeReferenceNode("null"),
            ])
        : undefined;
})(FunctionalIsFunctionProgrammer || (FunctionalIsFunctionProgrammer = {}));

export { FunctionalIsFunctionProgrammer };
//# sourceMappingURL=FunctionalIsFunctionProgrammer.mjs.map
