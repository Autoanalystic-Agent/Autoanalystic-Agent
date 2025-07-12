"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtobufAssertDecodeProgrammer = void 0;
const typescript_1 = __importDefault(require("typescript"));
const StatementFactory_1 = require("../../factories/StatementFactory");
const AssertProgrammer_1 = require("../AssertProgrammer");
const FeatureProgrammer_1 = require("../FeatureProgrammer");
const FunctionProgrammer_1 = require("../helpers/FunctionProgrammer");
const ProtobufDecodeProgrammer_1 = require("./ProtobufDecodeProgrammer");
var ProtobufAssertDecodeProgrammer;
(function (ProtobufAssertDecodeProgrammer) {
    ProtobufAssertDecodeProgrammer.decompose = (props) => {
        const assert = AssertProgrammer_1.AssertProgrammer.decompose(Object.assign(Object.assign({}, props), { context: Object.assign(Object.assign({}, props.context), { options: Object.assign(Object.assign({}, props.context.options), { functional: false, numeric: false }) }), config: {
                equals: false,
                guard: false,
            } }));
        const decode = ProtobufDecodeProgrammer_1.ProtobufDecodeProgrammer.decompose(props);
        return {
            functions: Object.assign(Object.assign({}, assert.functions), decode.functions),
            statements: [
                ...assert.statements,
                ...decode.statements,
                StatementFactory_1.StatementFactory.constant({
                    name: "__assert",
                    value: assert.arrow,
                }),
                StatementFactory_1.StatementFactory.constant({
                    name: "__decode",
                    value: decode.arrow,
                }),
            ],
            arrow: typescript_1.default.factory.createArrowFunction(undefined, undefined, [
                ...decode.arrow.parameters,
                AssertProgrammer_1.AssertProgrammer.Guardian.parameter({
                    context: props.context,
                    init: props.init,
                }),
            ], decode.arrow.type, undefined, typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createIdentifier("__assert"), undefined, [
                typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createIdentifier("__decode"), undefined, [typescript_1.default.factory.createIdentifier("input")]),
                AssertProgrammer_1.AssertProgrammer.Guardian.identifier(),
            ])),
        };
    };
    ProtobufAssertDecodeProgrammer.write = (props) => {
        const functor = new FunctionProgrammer_1.FunctionProgrammer(props.modulo.getText());
        const result = ProtobufAssertDecodeProgrammer.decompose(Object.assign(Object.assign({}, props), { functor }));
        return FeatureProgrammer_1.FeatureProgrammer.writeDecomposed({
            modulo: props.modulo,
            functor,
            result,
        });
    };
})(ProtobufAssertDecodeProgrammer || (exports.ProtobufAssertDecodeProgrammer = ProtobufAssertDecodeProgrammer = {}));
//# sourceMappingURL=ProtobufAssertDecodeProgrammer.js.map