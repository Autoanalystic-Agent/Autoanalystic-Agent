"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatementFactory = void 0;
const typescript_1 = __importDefault(require("typescript"));
const TypeFactory_1 = require("./TypeFactory");
var StatementFactory;
(function (StatementFactory) {
    StatementFactory.mut = (props) => typescript_1.default.factory.createVariableStatement(undefined, typescript_1.default.factory.createVariableDeclarationList([
        typescript_1.default.factory.createVariableDeclaration(props.name, undefined, props.type !== undefined
            ? props.type
            : props.initializer === undefined
                ? TypeFactory_1.TypeFactory.keyword("any")
                : undefined, props.initializer),
    ], typescript_1.default.NodeFlags.Let));
    StatementFactory.constant = (props) => typescript_1.default.factory.createVariableStatement(undefined, typescript_1.default.factory.createVariableDeclarationList([
        typescript_1.default.factory.createVariableDeclaration(props.name, undefined, props.type !== undefined
            ? props.type
            : props.value === undefined
                ? TypeFactory_1.TypeFactory.keyword("any")
                : undefined, props.value),
    ], typescript_1.default.NodeFlags.Const));
    StatementFactory.entry = (props) => typescript_1.default.factory.createVariableDeclarationList([
        typescript_1.default.factory.createVariableDeclaration(typescript_1.default.factory.createArrayBindingPattern([
            typescript_1.default.factory.createBindingElement(undefined, undefined, typescript_1.default.factory.createIdentifier(props.key), undefined),
            typescript_1.default.factory.createBindingElement(undefined, undefined, typescript_1.default.factory.createIdentifier(props.value), undefined),
        ]), undefined, undefined, undefined),
    ], typescript_1.default.NodeFlags.Const);
    StatementFactory.transpile = (script) => typescript_1.default.factory.createExpressionStatement(typescript_1.default.factory.createIdentifier(typescript_1.default.transpile(script)));
    StatementFactory.block = (expression) => typescript_1.default.factory.createBlock([typescript_1.default.factory.createExpressionStatement(expression)], true);
})(StatementFactory || (exports.StatementFactory = StatementFactory = {}));
//# sourceMappingURL=StatementFactory.js.map