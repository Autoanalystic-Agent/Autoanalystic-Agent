"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiscValidatePruneProgrammer = void 0;
const typescript_1 = __importDefault(require("typescript"));
const IdentifierFactory_1 = require("../../factories/IdentifierFactory");
const StatementFactory_1 = require("../../factories/StatementFactory");
const TypeFactory_1 = require("../../factories/TypeFactory");
const FeatureProgrammer_1 = require("../FeatureProgrammer");
const ValidateProgrammer_1 = require("../ValidateProgrammer");
const FunctionProgrammer_1 = require("../helpers/FunctionProgrammer");
const MiscPruneProgrammer_1 = require("./MiscPruneProgrammer");
var MiscValidatePruneProgrammer;
(function (MiscValidatePruneProgrammer) {
    MiscValidatePruneProgrammer.decompose = (props) => {
        var _a;
        const validate = ValidateProgrammer_1.ValidateProgrammer.decompose(Object.assign(Object.assign({}, props), { config: {
                equals: false,
            } }));
        const prune = MiscPruneProgrammer_1.MiscPruneProgrammer.decompose(Object.assign(Object.assign({}, props), { validated: true }));
        return {
            functions: Object.assign(Object.assign({}, validate.functions), prune.functions),
            statements: [
                ...validate.statements,
                ...prune.statements,
                StatementFactory_1.StatementFactory.constant({
                    name: "__validate",
                    value: validate.arrow,
                }),
                StatementFactory_1.StatementFactory.constant({
                    name: "__prune",
                    value: prune.arrow,
                }),
            ],
            arrow: typescript_1.default.factory.createArrowFunction(undefined, undefined, [IdentifierFactory_1.IdentifierFactory.parameter("input", TypeFactory_1.TypeFactory.keyword("any"))], props.context.importer.type({
                file: "typia",
                name: "IValidation",
                arguments: [
                    typescript_1.default.factory.createTypeReferenceNode((_a = props.name) !== null && _a !== void 0 ? _a : TypeFactory_1.TypeFactory.getFullName({
                        checker: props.context.checker,
                        type: props.type,
                    })),
                ],
            }), undefined, typescript_1.default.factory.createBlock([
                StatementFactory_1.StatementFactory.constant({
                    name: "result",
                    value: typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createIdentifier("__validate"), undefined, [typescript_1.default.factory.createIdentifier("input")]),
                }),
                typescript_1.default.factory.createIfStatement(typescript_1.default.factory.createIdentifier("result.success"), typescript_1.default.factory.createExpressionStatement(typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createIdentifier("__prune"), undefined, [typescript_1.default.factory.createIdentifier("input")]))),
                typescript_1.default.factory.createReturnStatement(typescript_1.default.factory.createIdentifier("result")),
            ], true)),
        };
    };
    MiscValidatePruneProgrammer.write = (props) => {
        const functor = new FunctionProgrammer_1.FunctionProgrammer(props.modulo.getText());
        const result = MiscValidatePruneProgrammer.decompose(Object.assign(Object.assign({}, props), { functor }));
        return FeatureProgrammer_1.FeatureProgrammer.writeDecomposed({
            modulo: props.modulo,
            functor,
            result,
        });
    };
})(MiscValidatePruneProgrammer || (exports.MiscValidatePruneProgrammer = MiscValidatePruneProgrammer = {}));
//# sourceMappingURL=MiscValidatePruneProgrammer.js.map