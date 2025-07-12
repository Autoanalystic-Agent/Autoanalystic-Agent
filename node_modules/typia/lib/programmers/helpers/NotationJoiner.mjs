import ts from 'typescript';
import { IdentifierFactory } from '../../factories/IdentifierFactory.mjs';
import { StatementFactory } from '../../factories/StatementFactory.mjs';
import { TypeFactory } from '../../factories/TypeFactory.mjs';
import { Escaper } from '../../utils/Escaper.mjs';
import { metadata_to_pattern } from '../internal/metadata_to_pattern.mjs';

var NotationJoiner;
(function (NotationJoiner) {
    NotationJoiner.object = (props) => {
        if (props.entries.length === 0)
            return ts.factory.createIdentifier("{}");
        const regular = props.entries.filter((e) => e.key.isSoleLiteral());
        const dynamic = props.entries.filter((e) => !e.key.isSoleLiteral());
        const literal = ts.factory.createObjectLiteralExpression(regular.map((entry) => {
            const str = props.rename(entry.key.getSoleLiteral());
            return ts.factory.createPropertyAssignment(Escaper.variable(str) ? str : ts.factory.createStringLiteral(str), entry.expression);
        }), true);
        if (dynamic.length === 0)
            return literal;
        const key = ts.factory.createIdentifier("key");
        const output = ts.factory.createIdentifier("output");
        const statements = [];
        if (regular.length !== 0)
            statements.push(ts.factory.createIfStatement(ts.factory.createCallExpression(IdentifierFactory.access(ts.factory.createArrayLiteralExpression(regular.map((r) => ts.factory.createStringLiteral(r.key.getSoleLiteral()))), "some"), undefined, [
                ts.factory.createArrowFunction(undefined, undefined, [IdentifierFactory.parameter("regular")], undefined, undefined, ts.factory.createStrictEquality(ts.factory.createIdentifier("regular"), ts.factory.createIdentifier("key"))),
            ]), ts.factory.createContinueStatement()));
        statements.push(...dynamic.map((entry) => ts.factory.createIfStatement(ts.factory.createCallExpression(ts.factory.createIdentifier(`RegExp(/${metadata_to_pattern({
            top: true,
            metadata: entry.key,
        })}/).test`), undefined, [key]), ts.factory.createBlock([
            ts.factory.createExpressionStatement(ts.factory.createBinaryExpression(ts.factory.createElementAccessExpression(output, key), ts.factory.createToken(ts.SyntaxKind.EqualsToken), entry.expression)),
            ts.factory.createContinueStatement(),
        ]))));
        return ts.factory.createBlock([
            StatementFactory.constant({
                name: "output",
                value: ts.factory.createAsExpression(literal, TypeFactory.keyword("any")),
            }),
            ts.factory.createForOfStatement(undefined, StatementFactory.entry({
                key: "key",
                value: "value",
            }), ts.factory.createCallExpression(ts.factory.createIdentifier("Object.entries"), undefined, [props.input]), ts.factory.createBlock(statements)),
            ts.factory.createReturnStatement(output),
        ]);
    };
    NotationJoiner.tuple = (props) => {
        return ts.factory.createAsExpression(ts.factory.createArrayLiteralExpression(props.rest === null
            ? props.elements
            : [...props.elements, ts.factory.createSpreadElement(props.rest)], true), TypeFactory.keyword("any"));
    };
    NotationJoiner.array = (props) => ts.factory.createCallExpression(ts.factory.createPropertyAccessExpression(props.input, "map"), undefined, [props.arrow]);
})(NotationJoiner || (NotationJoiner = {}));

export { NotationJoiner };
//# sourceMappingURL=NotationJoiner.mjs.map
