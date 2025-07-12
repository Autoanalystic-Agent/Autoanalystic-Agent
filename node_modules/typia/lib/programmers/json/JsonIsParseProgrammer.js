"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonIsParseProgrammer = void 0;
const typescript_1 = __importDefault(require("typescript"));
const IdentifierFactory_1 = require("../../factories/IdentifierFactory");
const StatementFactory_1 = require("../../factories/StatementFactory");
const TypeFactory_1 = require("../../factories/TypeFactory");
const FeatureProgrammer_1 = require("../FeatureProgrammer");
const IsProgrammer_1 = require("../IsProgrammer");
const FunctionProgrammer_1 = require("../helpers/FunctionProgrammer");
var JsonIsParseProgrammer;
(function (JsonIsParseProgrammer) {
    JsonIsParseProgrammer.decompose = (props) => {
        var _a;
        const is = IsProgrammer_1.IsProgrammer.decompose(Object.assign(Object.assign({}, props), { context: Object.assign(Object.assign({}, props.context), { options: Object.assign(Object.assign({}, props.context.options), { functional: false, numeric: false }) }), config: {
                equals: false,
            } }));
        return {
            functions: is.functions,
            statements: [
                ...is.statements,
                StatementFactory_1.StatementFactory.constant({
                    name: "__is",
                    value: is.arrow,
                }),
            ],
            arrow: typescript_1.default.factory.createArrowFunction(undefined, undefined, [IdentifierFactory_1.IdentifierFactory.parameter("input", TypeFactory_1.TypeFactory.keyword("string"))], typescript_1.default.factory.createUnionTypeNode([
                props.context.importer.type({
                    file: "typia",
                    name: "Primitive",
                    arguments: [
                        typescript_1.default.factory.createTypeReferenceNode((_a = props.name) !== null && _a !== void 0 ? _a : TypeFactory_1.TypeFactory.getFullName({
                            checker: props.context.checker,
                            type: props.type,
                        })),
                    ],
                }),
                typescript_1.default.factory.createTypeReferenceNode("null"),
            ]), undefined, typescript_1.default.factory.createBlock([
                typescript_1.default.factory.createExpressionStatement(typescript_1.default.factory.createBinaryExpression(typescript_1.default.factory.createIdentifier("input"), typescript_1.default.SyntaxKind.EqualsToken, typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createIdentifier("JSON.parse"), undefined, [typescript_1.default.factory.createIdentifier("input")]))),
                typescript_1.default.factory.createReturnStatement(typescript_1.default.factory.createConditionalExpression(typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createIdentifier("__is"), undefined, [typescript_1.default.factory.createIdentifier("input")]), undefined, typescript_1.default.factory.createAsExpression(typescript_1.default.factory.createIdentifier("input"), TypeFactory_1.TypeFactory.keyword("any")), undefined, typescript_1.default.factory.createNull())),
            ])),
        };
    };
    JsonIsParseProgrammer.write = (props) => {
        const functor = new FunctionProgrammer_1.FunctionProgrammer(props.modulo.getText());
        const result = JsonIsParseProgrammer.decompose({
            context: props.context,
            functor,
            type: props.type,
            name: props.name,
        });
        return FeatureProgrammer_1.FeatureProgrammer.writeDecomposed({
            modulo: props.modulo,
            functor,
            result,
        });
    };
})(JsonIsParseProgrammer || (exports.JsonIsParseProgrammer = JsonIsParseProgrammer = {}));
//# sourceMappingURL=JsonIsParseProgrammer.js.map