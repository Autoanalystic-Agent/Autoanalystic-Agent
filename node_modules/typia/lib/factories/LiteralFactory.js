"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiteralFactory = void 0;
const typescript_1 = __importDefault(require("typescript"));
const ExpressionFactory_1 = require("./ExpressionFactory");
const IdentifierFactory_1 = require("./IdentifierFactory");
var LiteralFactory;
(function (LiteralFactory) {
    LiteralFactory.write = (input) => {
        if (input === null)
            return typescript_1.default.factory.createNull();
        else if (typescript_1.default.isArrowFunction(input))
            return input;
        else if (typescript_1.default.isCallExpression(input))
            return input;
        else if (typescript_1.default.isIdentifier(input))
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
            return typescript_1.default.factory.createIdentifier("undefined");
        else
            throw new TypeError("Error on LiteralFactory.generate(): unknown type.");
    };
    const writeObject = (obj) => typescript_1.default.factory.createObjectLiteralExpression(Object.entries(obj)
        .filter((tuple) => tuple[1] !== undefined)
        .map(([key, value]) => typescript_1.default.factory.createPropertyAssignment(IdentifierFactory_1.IdentifierFactory.identifier(key), LiteralFactory.write(value))), true);
    const writeArray = (array) => typescript_1.default.factory.createArrayLiteralExpression(array.map(LiteralFactory.write), true);
    const writeBoolean = (value) => value ? typescript_1.default.factory.createTrue() : typescript_1.default.factory.createFalse();
    const writeNumber = (value) => ExpressionFactory_1.ExpressionFactory.number(value);
    const writeBigint = (value) => ExpressionFactory_1.ExpressionFactory.bigint(value);
    const writeStrinng = (value) => typescript_1.default.factory.createStringLiteral(value);
})(LiteralFactory || (exports.LiteralFactory = LiteralFactory = {}));
//# sourceMappingURL=LiteralFactory.js.map