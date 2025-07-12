"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonAssertParseProgrammer = void 0;
const typescript_1 = __importDefault(require("typescript"));
const IdentifierFactory_1 = require("../../factories/IdentifierFactory");
const JsonMetadataFactory_1 = require("../../factories/JsonMetadataFactory");
const StatementFactory_1 = require("../../factories/StatementFactory");
const TypeFactory_1 = require("../../factories/TypeFactory");
const AssertProgrammer_1 = require("../AssertProgrammer");
const FeatureProgrammer_1 = require("../FeatureProgrammer");
const FunctionProgrammer_1 = require("../helpers/FunctionProgrammer");
var JsonAssertParseProgrammer;
(function (JsonAssertParseProgrammer) {
    JsonAssertParseProgrammer.decompose = (props) => {
        var _a;
        JsonMetadataFactory_1.JsonMetadataFactory.analyze({
            method: props.functor.method,
            checker: props.context.checker,
            transformer: props.context.transformer,
            type: props.type,
        });
        const assert = AssertProgrammer_1.AssertProgrammer.decompose(Object.assign(Object.assign({}, props), { context: Object.assign(Object.assign({}, props.context), { options: Object.assign(Object.assign({}, props.context.options), { functional: false, numeric: false }) }), config: {
                equals: false,
                guard: false,
            } }));
        return {
            functions: assert.functions,
            statements: [
                ...assert.statements,
                StatementFactory_1.StatementFactory.constant({
                    name: "__assert",
                    value: assert.arrow,
                }),
            ],
            arrow: typescript_1.default.factory.createArrowFunction(undefined, undefined, [
                IdentifierFactory_1.IdentifierFactory.parameter("input", TypeFactory_1.TypeFactory.keyword("string")),
                AssertProgrammer_1.AssertProgrammer.Guardian.parameter({
                    context: props.context,
                    init: props.init,
                }),
            ], props.context.importer.type({
                file: "typia",
                name: "Primitive",
                arguments: [
                    typescript_1.default.factory.createTypeReferenceNode((_a = props.name) !== null && _a !== void 0 ? _a : TypeFactory_1.TypeFactory.getFullName({
                        checker: props.context.checker,
                        type: props.type,
                    })),
                ],
            }), undefined, typescript_1.default.factory.createAsExpression(typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createIdentifier("__assert"), undefined, [
                typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createIdentifier("JSON.parse"), undefined, [typescript_1.default.factory.createIdentifier("input")]),
                AssertProgrammer_1.AssertProgrammer.Guardian.identifier(),
            ]), TypeFactory_1.TypeFactory.keyword("any"))),
        };
    };
    JsonAssertParseProgrammer.write = (props) => {
        const functor = new FunctionProgrammer_1.FunctionProgrammer(props.modulo.getText());
        const result = JsonAssertParseProgrammer.decompose({
            context: props.context,
            functor,
            type: props.type,
            name: props.name,
            init: props.init,
        });
        return FeatureProgrammer_1.FeatureProgrammer.writeDecomposed({
            modulo: props.modulo,
            functor,
            result,
        });
    };
})(JsonAssertParseProgrammer || (exports.JsonAssertParseProgrammer = JsonAssertParseProgrammer = {}));
//# sourceMappingURL=JsonAssertParseProgrammer.js.map