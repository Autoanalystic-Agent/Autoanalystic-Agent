"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunctionalIsFunctionProgrammer = void 0;
const typescript_1 = __importDefault(require("typescript"));
const ExpressionFactory_1 = require("../../factories/ExpressionFactory");
const FunctionalIsParametersProgrammer_1 = require("./FunctionalIsParametersProgrammer");
const FunctionalIsReturnProgrammer_1 = require("./FunctionalIsReturnProgrammer");
var FunctionalIsFunctionProgrammer;
(function (FunctionalIsFunctionProgrammer) {
    FunctionalIsFunctionProgrammer.write = (props) => {
        const p = FunctionalIsParametersProgrammer_1.FunctionalIsParametersProgrammer.decompose(props);
        const r = FunctionalIsReturnProgrammer_1.FunctionalIsReturnProgrammer.decompose(props);
        return ExpressionFactory_1.ExpressionFactory.selfCall(typescript_1.default.factory.createBlock([
            ...p.functions,
            ...r.functions,
            typescript_1.default.factory.createReturnStatement(typescript_1.default.factory.createArrowFunction(r.async
                ? [typescript_1.default.factory.createModifier(typescript_1.default.SyntaxKind.AsyncKeyword)]
                : undefined, undefined, props.declaration.parameters, FunctionalIsFunctionProgrammer.getReturnTypeNode({
                declaration: props.declaration,
                async: r.async,
            }), undefined, typescript_1.default.factory.createBlock([...p.statements, ...r.statements], true))),
        ], true));
    };
    FunctionalIsFunctionProgrammer.getReturnTypeNode = (props) => {
        var _a;
        return props.declaration.type
            ? props.async
                ? !!((_a = props.declaration.type.typeArguments) === null || _a === void 0 ? void 0 : _a[0])
                    ? typescript_1.default.factory.createTypeReferenceNode("Promise", [
                        typescript_1.default.factory.createUnionTypeNode([
                            props.declaration.type
                                .typeArguments[0],
                            typescript_1.default.factory.createTypeReferenceNode("null"),
                        ]),
                    ])
                    : undefined
                : typescript_1.default.factory.createUnionTypeNode([
                    props.declaration.type,
                    typescript_1.default.factory.createTypeReferenceNode("null"),
                ])
            : undefined;
    };
})(FunctionalIsFunctionProgrammer || (exports.FunctionalIsFunctionProgrammer = FunctionalIsFunctionProgrammer = {}));
//# sourceMappingURL=FunctionalIsFunctionProgrammer.js.map