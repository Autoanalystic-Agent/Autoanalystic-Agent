"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonValidateParseProgrammer = void 0;
const typescript_1 = __importDefault(require("typescript"));
const IdentifierFactory_1 = require("../../factories/IdentifierFactory");
const StatementFactory_1 = require("../../factories/StatementFactory");
const TypeFactory_1 = require("../../factories/TypeFactory");
const FeatureProgrammer_1 = require("../FeatureProgrammer");
const ValidateProgrammer_1 = require("../ValidateProgrammer");
const FunctionProgrammer_1 = require("../helpers/FunctionProgrammer");
var JsonValidateParseProgrammer;
(function (JsonValidateParseProgrammer) {
    JsonValidateParseProgrammer.decompose = (props) => {
        var _a;
        const validate = ValidateProgrammer_1.ValidateProgrammer.decompose(Object.assign(Object.assign({}, props), { context: Object.assign(Object.assign({}, props.context), { options: Object.assign(Object.assign({}, props.context.options), { functional: false, numeric: false }) }), config: {
                equals: false,
            } }));
        return {
            functions: validate.functions,
            statements: [
                ...validate.statements,
                StatementFactory_1.StatementFactory.constant({
                    name: "__validate",
                    value: validate.arrow,
                }),
            ],
            arrow: typescript_1.default.factory.createArrowFunction(undefined, undefined, [IdentifierFactory_1.IdentifierFactory.parameter("input", TypeFactory_1.TypeFactory.keyword("string"))], props.context.importer.type({
                file: "typia",
                name: "IValidation",
                arguments: [
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
                ],
            }), undefined, typescript_1.default.factory.createAsExpression(typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createIdentifier("__validate"), undefined, [
                typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createIdentifier("JSON.parse"), undefined, [typescript_1.default.factory.createIdentifier("input")]),
            ]), typescript_1.default.factory.createTypeReferenceNode("any"))),
        };
    };
    JsonValidateParseProgrammer.write = (props) => {
        const functor = new FunctionProgrammer_1.FunctionProgrammer(props.modulo.getText());
        const result = JsonValidateParseProgrammer.decompose({
            context: props.context,
            modulo: props.modulo,
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
})(JsonValidateParseProgrammer || (exports.JsonValidateParseProgrammer = JsonValidateParseProgrammer = {}));
//# sourceMappingURL=JsonValidateParseProgrammer.js.map