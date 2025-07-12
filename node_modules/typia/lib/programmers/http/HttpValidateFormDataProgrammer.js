"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpValidateFormDataProgrammer = void 0;
const typescript_1 = __importDefault(require("typescript"));
const StatementFactory_1 = require("../../factories/StatementFactory");
const TypeFactory_1 = require("../../factories/TypeFactory");
const FeatureProgrammer_1 = require("../FeatureProgrammer");
const ValidateProgrammer_1 = require("../ValidateProgrammer");
const FunctionProgrammer_1 = require("../helpers/FunctionProgrammer");
const HttpFormDataProgrammer_1 = require("./HttpFormDataProgrammer");
var HttpValidateFormDataProgrammer;
(function (HttpValidateFormDataProgrammer) {
    HttpValidateFormDataProgrammer.decompose = (props) => {
        var _a;
        const validate = ValidateProgrammer_1.ValidateProgrammer.decompose(Object.assign(Object.assign({}, props), { context: Object.assign(Object.assign({}, props.context), { options: Object.assign(Object.assign({}, props.context.options), { functional: false, numeric: false }) }), config: {
                equals: false,
            } }));
        const decode = HttpFormDataProgrammer_1.HttpFormDataProgrammer.decompose(props);
        return {
            functions: Object.assign(Object.assign({}, validate.functions), decode.functions),
            statements: [
                ...validate.statements,
                StatementFactory_1.StatementFactory.constant({
                    name: "__validate",
                    value: validate.arrow,
                }),
                StatementFactory_1.StatementFactory.constant({
                    name: "__decode",
                    value: decode.arrow,
                }),
            ],
            arrow: typescript_1.default.factory.createArrowFunction(undefined, undefined, decode.arrow.parameters, props.context.importer.type({
                file: "typia",
                name: "IValidation",
                arguments: [(_a = decode.arrow.type) !== null && _a !== void 0 ? _a : TypeFactory_1.TypeFactory.keyword("any")],
            }), undefined, typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createIdentifier("__validate"), undefined, [
                typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createIdentifier("__decode"), undefined, [typescript_1.default.factory.createIdentifier("input")]),
            ])),
        };
    };
    HttpValidateFormDataProgrammer.write = (props) => {
        const functor = new FunctionProgrammer_1.FunctionProgrammer(props.modulo.getText());
        const result = HttpValidateFormDataProgrammer.decompose(Object.assign(Object.assign({}, props), { functor }));
        return FeatureProgrammer_1.FeatureProgrammer.writeDecomposed({
            modulo: props.modulo,
            functor,
            result,
        });
    };
})(HttpValidateFormDataProgrammer || (exports.HttpValidateFormDataProgrammer = HttpValidateFormDataProgrammer = {}));
//# sourceMappingURL=HttpValidateFormDataProgrammer.js.map