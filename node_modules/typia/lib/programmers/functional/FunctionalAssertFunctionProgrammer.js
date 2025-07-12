"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunctionalAssertFunctionProgrammer = void 0;
const typescript_1 = __importDefault(require("typescript"));
const ExpressionFactory_1 = require("../../factories/ExpressionFactory");
const IdentifierFactory_1 = require("../../factories/IdentifierFactory");
const StringUtil_1 = require("../../utils/StringUtil");
const AssertProgrammer_1 = require("../AssertProgrammer");
const FunctionalAssertParametersProgrammer_1 = require("./FunctionalAssertParametersProgrammer");
const FunctionalAssertReturnProgrammer_1 = require("./FunctionalAssertReturnProgrammer");
var FunctionalAssertFunctionProgrammer;
(function (FunctionalAssertFunctionProgrammer) {
    FunctionalAssertFunctionProgrammer.write = (props) => {
        const wrapper = FunctionalAssertFunctionProgrammer.errorFactoryWrapper({
            context: props.context,
            parameters: props.declaration.parameters,
            init: props.init,
        });
        const p = FunctionalAssertParametersProgrammer_1.FunctionalAssertParametersProgrammer.decompose({
            context: props.context,
            modulo: props.modulo,
            config: props.config,
            parameters: props.declaration.parameters,
            wrapper: wrapper.name,
        });
        const r = FunctionalAssertReturnProgrammer_1.FunctionAssertReturnProgrammer.decompose({
            context: props.context,
            modulo: props.modulo,
            config: props.config,
            expression: props.expression,
            declaration: props.declaration,
            wrapper: wrapper.name,
        });
        return ExpressionFactory_1.ExpressionFactory.selfCall(typescript_1.default.factory.createBlock([
            wrapper.variable,
            ...p.functions,
            ...r.functions,
            typescript_1.default.factory.createReturnStatement(typescript_1.default.factory.createArrowFunction(r.async
                ? [typescript_1.default.factory.createModifier(typescript_1.default.SyntaxKind.AsyncKeyword)]
                : undefined, undefined, props.declaration.parameters, props.declaration.type, undefined, typescript_1.default.factory.createBlock([
                ...p.expressions.map(typescript_1.default.factory.createExpressionStatement),
                typescript_1.default.factory.createReturnStatement(r.value),
            ]))),
        ], true));
    };
    FunctionalAssertFunctionProgrammer.errorFactoryWrapper = (props) => {
        var _a;
        const name = StringUtil_1.StringUtil.escapeDuplicate({
            keep: props.parameters.map((p) => p.name.getText()),
            input: "errorFactoryWrapper",
        });
        const variable = typescript_1.default.factory.createVariableStatement(undefined, typescript_1.default.factory.createVariableDeclarationList([
            typescript_1.default.factory.createVariableDeclaration(name, undefined, AssertProgrammer_1.AssertProgrammer.Guardian.type(props.context), (_a = props.init) !== null && _a !== void 0 ? _a : props.context.importer.internal("functionalTypeGuardErrorFactory")),
        ], typescript_1.default.NodeFlags.Const));
        return { name, variable };
    };
    FunctionalAssertFunctionProgrammer.hookPath = (props) => typescript_1.default.factory.createArrowFunction(undefined, undefined, [IdentifierFactory_1.IdentifierFactory.parameter("p")], undefined, undefined, typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createIdentifier(props.wrapper), undefined, [
        typescript_1.default.factory.createObjectLiteralExpression([
            typescript_1.default.factory.createSpreadAssignment(typescript_1.default.factory.createIdentifier("p")),
            typescript_1.default.factory.createPropertyAssignment("path", typescript_1.default.factory.createConditionalExpression(typescript_1.default.factory.createPropertyAccessExpression(typescript_1.default.factory.createIdentifier("p"), "path"), undefined, typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createPropertyAccessExpression(typescript_1.default.factory.createPropertyAccessExpression(typescript_1.default.factory.createIdentifier("p"), "path"), "replace"), undefined, [
                typescript_1.default.factory.createStringLiteral("$input"),
                typescript_1.default.factory.createStringLiteral(props.replacer),
            ]), undefined, typescript_1.default.factory.createIdentifier("undefined"))),
        ]),
    ]));
})(FunctionalAssertFunctionProgrammer || (exports.FunctionalAssertFunctionProgrammer = FunctionalAssertFunctionProgrammer = {}));
//# sourceMappingURL=FunctionalAssertFunctionProgrammer.js.map