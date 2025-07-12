"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunctionalValidateFunctionProgrammer = void 0;
const typescript_1 = __importDefault(require("typescript"));
const ExpressionFactory_1 = require("../../factories/ExpressionFactory");
const IdentifierFactory_1 = require("../../factories/IdentifierFactory");
const FunctionalValidateParametersProgrammer_1 = require("./FunctionalValidateParametersProgrammer");
const FunctionalValidateReturnProgrammer_1 = require("./FunctionalValidateReturnProgrammer");
var FunctionalValidateFunctionProgrammer;
(function (FunctionalValidateFunctionProgrammer) {
    FunctionalValidateFunctionProgrammer.write = (props) => {
        const p = FunctionalValidateParametersProgrammer_1.FunctionalValidateParametersProgrammer.decompose(props);
        const r = FunctionalValidateReturnProgrammer_1.FunctionalValidateReturnProgrammer.decompose(props);
        return ExpressionFactory_1.ExpressionFactory.selfCall(typescript_1.default.factory.createBlock([
            ...p.functions,
            ...r.functions,
            typescript_1.default.factory.createReturnStatement(typescript_1.default.factory.createArrowFunction(r.async
                ? [typescript_1.default.factory.createModifier(typescript_1.default.SyntaxKind.AsyncKeyword)]
                : undefined, undefined, props.declaration.parameters, FunctionalValidateFunctionProgrammer.getReturnTypeNode({
                context: props.context,
                declaration: props.declaration,
                async: r.async,
            }), undefined, typescript_1.default.factory.createBlock([...p.statements, ...r.statements], true))),
        ], true));
    };
    FunctionalValidateFunctionProgrammer.hookErrors = (props) => typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createPropertyAccessExpression(props.expression, "map"), undefined, [
        typescript_1.default.factory.createArrowFunction(undefined, undefined, [IdentifierFactory_1.IdentifierFactory.parameter("error")], undefined, undefined, typescript_1.default.factory.createObjectLiteralExpression([
            typescript_1.default.factory.createSpreadAssignment(typescript_1.default.factory.createIdentifier("error")),
            typescript_1.default.factory.createPropertyAssignment("path", typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createPropertyAccessExpression(typescript_1.default.factory.createPropertyAccessExpression(typescript_1.default.factory.createIdentifier("error"), "path"), "replace"), undefined, [typescript_1.default.factory.createStringLiteral("$input"), props.replacer])),
        ], true)),
    ]);
    FunctionalValidateFunctionProgrammer.getReturnTypeNode = (props) => {
        var _a;
        return props.declaration.type
            ? props.async
                ? !!((_a = props.declaration.type.typeArguments) === null || _a === void 0 ? void 0 : _a[0])
                    ? typescript_1.default.factory.createTypeReferenceNode("Promise", [
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
    };
})(FunctionalValidateFunctionProgrammer || (exports.FunctionalValidateFunctionProgrammer = FunctionalValidateFunctionProgrammer = {}));
//# sourceMappingURL=FunctionalValidateFunctionProgrammer.js.map