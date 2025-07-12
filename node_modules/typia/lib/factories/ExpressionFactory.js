"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressionFactory = void 0;
const typescript_1 = __importDefault(require("typescript"));
const _randomFormatUuid_1 = require("../internal/_randomFormatUuid");
var ExpressionFactory;
(function (ExpressionFactory) {
    ExpressionFactory.number = (value) => value < 0
        ? typescript_1.default.factory.createPrefixUnaryExpression(typescript_1.default.SyntaxKind.MinusToken, typescript_1.default.factory.createNumericLiteral(Math.abs(value)))
        : typescript_1.default.factory.createNumericLiteral(value);
    ExpressionFactory.bigint = (value) => typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createIdentifier("BigInt"), undefined, [typescript_1.default.factory.createIdentifier(value.toString())]);
    ExpressionFactory.isRequired = (input) => typescript_1.default.factory.createStrictInequality(typescript_1.default.factory.createIdentifier("undefined"), input);
    ExpressionFactory.isArray = (input) => typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createIdentifier("Array.isArray"), undefined, [input]);
    ExpressionFactory.isObject = (props) => {
        const conditions = [
            typescript_1.default.factory.createStrictEquality(typescript_1.default.factory.createStringLiteral("object"), typescript_1.default.factory.createTypeOfExpression(props.input)),
        ];
        if (props.checkNull === true)
            conditions.push(typescript_1.default.factory.createStrictInequality(typescript_1.default.factory.createNull(), props.input));
        if (props.checkArray === true)
            conditions.push(typescript_1.default.factory.createStrictEquality(typescript_1.default.factory.createFalse(), typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createIdentifier("Array.isArray"), undefined, [props.input])));
        return conditions.length === 1
            ? conditions[0]
            : conditions.reduce((x, y) => typescript_1.default.factory.createLogicalAnd(x, y));
    };
    ExpressionFactory.isInstanceOf = (type, input) => {
        return typescript_1.default.factory.createBinaryExpression(input, typescript_1.default.factory.createToken(typescript_1.default.SyntaxKind.InstanceOfKeyword), typescript_1.default.factory.createIdentifier(type));
    };
    ExpressionFactory.coalesce = (x, y) => typescript_1.default.factory.createBinaryExpression(x, typescript_1.default.factory.createToken(typescript_1.default.SyntaxKind.QuestionQuestionToken), y);
    ExpressionFactory.currying = (props) => {
        if (props.arguments.length === 0)
            return typescript_1.default.factory.createCallExpression(props.function, undefined, undefined);
        let prev = typescript_1.default.factory.createCallExpression(props.function, undefined, [props.arguments[0]]);
        for (const param of props.arguments.slice(1))
            prev = typescript_1.default.factory.createCallExpression(prev, undefined, [param]);
        return prev;
    };
    ExpressionFactory.selfCall = (body, type) => typescript_1.default.isCallExpression(body)
        ? body
        : typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createParenthesizedExpression(typescript_1.default.factory.createArrowFunction(undefined, undefined, [], type, undefined, body)), undefined, undefined);
    ExpressionFactory.getEscapedText = (props) => props.printer.printNode(typescript_1.default.EmitHint.Expression, props.input, props.input.getSourceFile());
    ExpressionFactory.transpile = (props) => {
        const file = typescript_1.default.createSourceFile(`${(0, _randomFormatUuid_1._randomFormatUuid)()}.ts`, props.script, typescript_1.default.ScriptTarget.ESNext, true, typescript_1.default.ScriptKind.TS);
        const statement = file.statements[0];
        if (statement === undefined)
            throw new ReferenceError("Error on ExpressionFactory.transpile(): no statement exists.");
        else if (!typescript_1.default.isExpressionStatement(statement))
            throw new TypeError("Error on ExpressionFactory.transpile(): statement is not an expression statement.");
        return (input) => {
            const visitor = (node) => {
                if (typescript_1.default.isIdentifier(node) && node.text === "$input")
                    return input;
                else if (props.importer !== undefined && typescript_1.default.isCallExpression(node))
                    if (node.expression.getText() === "$importInternal" &&
                        node.arguments.length === 1 &&
                        typescript_1.default.isStringLiteralLike(node.arguments[0])) {
                        const name = node.arguments[0].text;
                        return props.importer.internal(name);
                    }
                    else if (node.expression.getText() === "$importInstance" &&
                        node.arguments.length === 2 &&
                        typescript_1.default.isStringLiteralLike(node.arguments[0]) &&
                        typescript_1.default.isStringLiteralLike(node.arguments[1])) {
                        const name = node.arguments[0].text;
                        const file = node.arguments[1].text;
                        return props.importer.instance({
                            file,
                            name,
                            alias: null,
                        });
                    }
                    else if (node.expression.getText() === "$importNamespace" &&
                        node.arguments.length === 2 &&
                        typescript_1.default.isStringLiteralLike(node.arguments[0]) &&
                        typescript_1.default.isStringLiteralLike(node.arguments[1])) {
                        const name = node.arguments[0].text;
                        const file = node.arguments[1].text;
                        return props.importer.namespace({
                            file,
                            name,
                        });
                    }
                    else if (node.expression.getText() === "$importDefault" &&
                        node.arguments.length === 3 &&
                        typescript_1.default.isStringLiteralLike(node.arguments[0]) &&
                        typescript_1.default.isStringLiteralLike(node.arguments[1])) {
                        const name = node.arguments[0].text;
                        const file = node.arguments[1].text;
                        return props.importer.default({
                            file,
                            name,
                            type: false,
                        });
                    }
                return typescript_1.default.visitEachChild(typescript_1.default.factory.cloneNode(node), visitor, props.transformer);
            };
            return visitor(typescript_1.default.factory.cloneNode(statement.expression));
        };
    };
})(ExpressionFactory || (exports.ExpressionFactory = ExpressionFactory = {}));
//# sourceMappingURL=ExpressionFactory.js.map