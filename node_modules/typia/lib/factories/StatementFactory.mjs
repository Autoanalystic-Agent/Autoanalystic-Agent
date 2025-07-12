import ts from 'typescript';
import { TypeFactory } from './TypeFactory.mjs';

var StatementFactory;
(function (StatementFactory) {
    StatementFactory.mut = (props) => ts.factory.createVariableStatement(undefined, ts.factory.createVariableDeclarationList([
        ts.factory.createVariableDeclaration(props.name, undefined, props.type !== undefined
            ? props.type
            : props.initializer === undefined
                ? TypeFactory.keyword("any")
                : undefined, props.initializer),
    ], ts.NodeFlags.Let));
    StatementFactory.constant = (props) => ts.factory.createVariableStatement(undefined, ts.factory.createVariableDeclarationList([
        ts.factory.createVariableDeclaration(props.name, undefined, props.type !== undefined
            ? props.type
            : props.value === undefined
                ? TypeFactory.keyword("any")
                : undefined, props.value),
    ], ts.NodeFlags.Const));
    StatementFactory.entry = (props) => ts.factory.createVariableDeclarationList([
        ts.factory.createVariableDeclaration(ts.factory.createArrayBindingPattern([
            ts.factory.createBindingElement(undefined, undefined, ts.factory.createIdentifier(props.key), undefined),
            ts.factory.createBindingElement(undefined, undefined, ts.factory.createIdentifier(props.value), undefined),
        ]), undefined, undefined, undefined),
    ], ts.NodeFlags.Const);
    StatementFactory.transpile = (script) => ts.factory.createExpressionStatement(ts.factory.createIdentifier(ts.transpile(script)));
    StatementFactory.block = (expression) => ts.factory.createBlock([ts.factory.createExpressionStatement(expression)], true);
})(StatementFactory || (StatementFactory = {}));

export { StatementFactory };
//# sourceMappingURL=StatementFactory.mjs.map
