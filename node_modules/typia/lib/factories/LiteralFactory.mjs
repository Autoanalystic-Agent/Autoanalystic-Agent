import ts from 'typescript';
import { ExpressionFactory } from './ExpressionFactory.mjs';
import { IdentifierFactory } from './IdentifierFactory.mjs';

var LiteralFactory;
(function (LiteralFactory) {
    LiteralFactory.write = (input) => {
        if (input === null)
            return ts.factory.createNull();
        else if (ts.isArrowFunction(input))
            return input;
        else if (ts.isCallExpression(input))
            return input;
        else if (ts.isIdentifier(input))
            return input;
        else if (input instanceof Array)
            return writeArray(input);
        else if (typeof input === "object")
            return writeObject(input);
        else if (typeof input === "boolean")
            return writeBoolean(input);
        else if (typeof input === "bigint")
            return writeBigint(input);
        else if (typeof input === "number")
            return writeNumber(input);
        else if (typeof input === "string")
            return writeStrinng(input);
        // unreachable code
        else if (typeof input === "function")
            return ts.factory.createIdentifier("undefined");
        else
            throw new TypeError("Error on LiteralFactory.generate(): unknown type.");
    };
    const writeObject = (obj) => ts.factory.createObjectLiteralExpression(Object.entries(obj)
        .filter((tuple) => tuple[1] !== undefined)
        .map(([key, value]) => ts.factory.createPropertyAssignment(IdentifierFactory.identifier(key), LiteralFactory.write(value))), true);
    const writeArray = (array) => ts.factory.createArrayLiteralExpression(array.map(LiteralFactory.write), true);
    const writeBoolean = (value) => value ? ts.factory.createTrue() : ts.factory.createFalse();
    const writeNumber = (value) => ExpressionFactory.number(value);
    const writeBigint = (value) => ExpressionFactory.bigint(value);
    const writeStrinng = (value) => ts.factory.createStringLiteral(value);
})(LiteralFactory || (LiteralFactory = {}));

export { LiteralFactory };
//# sourceMappingURL=LiteralFactory.mjs.map
