import ts from 'typescript';
import { StatementFactory } from '../../factories/StatementFactory.mjs';
import { TypeFactory } from '../../factories/TypeFactory.mjs';
import { FeatureProgrammer } from '../FeatureProgrammer.mjs';
import { IsProgrammer } from '../IsProgrammer.mjs';
import { FunctionProgrammer } from '../helpers/FunctionProgrammer.mjs';
import { HttpQueryProgrammer } from './HttpQueryProgrammer.mjs';

var HttpIsQueryProgrammer;
(function (HttpIsQueryProgrammer) {
    HttpIsQueryProgrammer.decompose = (props) => {
        const is = IsProgrammer.decompose({
            ...props,
            context: {
                ...props.context,
                options: {
                    ...props.context.options,
                    functional: false,
                    numeric: true,
                },
            },
            config: {
                equals: false,
            },
        });
        const decode = HttpQueryProgrammer.decompose(props);
        return {
            functions: {
                ...is.functions,
                ...decode.functions,
            },
            statements: [
                ...is.statements,
                ...decode.statements,
                StatementFactory.constant({
                    name: "__is",
                    value: is.arrow,
                }),
                StatementFactory.constant({
                    name: "__decode",
                    value: decode.arrow,
                }),
            ],
            arrow: ts.factory.createArrowFunction(undefined, undefined, decode.arrow.parameters, ts.factory.createUnionTypeNode([
                decode.arrow.type ?? TypeFactory.keyword("any"),
                ts.factory.createTypeReferenceNode("null"),
            ]), undefined, ts.factory.createBlock([
                StatementFactory.constant({
                    name: "value",
                    value: ts.factory.createCallExpression(ts.factory.createIdentifier("__decode"), undefined, [ts.factory.createIdentifier("input")]),
                }),
                ts.factory.createIfStatement(ts.factory.createPrefixUnaryExpression(ts.SyntaxKind.ExclamationToken, ts.factory.createCallExpression(ts.factory.createIdentifier("__is"), undefined, [ts.factory.createIdentifier("value")])), ts.factory.createReturnStatement(ts.factory.createNull())),
                ts.factory.createReturnStatement(ts.factory.createIdentifier("value")),
            ], true)),
        };
    };
    HttpIsQueryProgrammer.write = (props) => {
        const functor = new FunctionProgrammer(props.modulo.getText());
        const result = HttpIsQueryProgrammer.decompose({
            ...props,
            functor,
            allowOptional: !!props.allowOptional,
        });
        return FeatureProgrammer.writeDecomposed({
            modulo: props.modulo,
            functor,
            result,
        });
    };
})(HttpIsQueryProgrammer || (HttpIsQueryProgrammer = {}));

export { HttpIsQueryProgrammer };
//# sourceMappingURL=HttpIsQueryProgrammer.mjs.map
