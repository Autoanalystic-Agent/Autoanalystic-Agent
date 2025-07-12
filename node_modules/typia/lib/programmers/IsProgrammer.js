"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsProgrammer = void 0;
const typescript_1 = __importDefault(require("typescript"));
const ExpressionFactory_1 = require("../factories/ExpressionFactory");
const IdentifierFactory_1 = require("../factories/IdentifierFactory");
const ValueFactory_1 = require("../factories/ValueFactory");
const CheckerProgrammer_1 = require("./CheckerProgrammer");
const FeatureProgrammer_1 = require("./FeatureProgrammer");
const FunctionProgrammer_1 = require("./helpers/FunctionProgrammer");
const OptionPredicator_1 = require("./helpers/OptionPredicator");
const check_object_1 = require("./internal/check_object");
var IsProgrammer;
(function (IsProgrammer) {
    IsProgrammer.configure = (props) => {
        var _a, _b, _c;
        return ({
            prefix: "_i",
            equals: !!((_a = props.options) === null || _a === void 0 ? void 0 : _a.object),
            trace: false,
            path: false,
            numeric: OptionPredicator_1.OptionPredicator.numeric({
                numeric: (_b = props.options) === null || _b === void 0 ? void 0 : _b.numeric,
            }),
            atomist: ({ entry }) => [
                ...(entry.expression ? [entry.expression] : []),
                ...(entry.conditions.length === 0
                    ? []
                    : [
                        entry.conditions
                            .map((set) => set
                            .map((s) => s.expression)
                            .reduce((a, b) => typescript_1.default.factory.createLogicalAnd(a, b)))
                            .reduce((a, b) => typescript_1.default.factory.createLogicalOr(a, b)),
                    ]),
            ].reduce((x, y) => typescript_1.default.factory.createLogicalAnd(x, y)),
            combiner: (next) => {
                const initial = next.logic === "and"
                    ? typescript_1.default.factory.createTrue()
                    : typescript_1.default.factory.createFalse();
                const binder = next.logic === "and"
                    ? typescript_1.default.factory.createLogicalAnd
                    : typescript_1.default.factory.createLogicalOr;
                return next.binaries.length
                    ? next.binaries.map((binary) => binary.expression).reduce(binder)
                    : initial;
            },
            joiner: {
                object: ((_c = props.options) === null || _c === void 0 ? void 0 : _c.object)
                    ? (v) => props.options.object(v)
                    : (v) => {
                        var _a, _b;
                        return (0, check_object_1.check_object)({
                            config: {
                                equals: !!((_a = props.options) === null || _a === void 0 ? void 0 : _a.object),
                                undefined: OptionPredicator_1.OptionPredicator.undefined({
                                    undefined: (_b = props.options) === null || _b === void 0 ? void 0 : _b.undefined,
                                }),
                                assert: true,
                                reduce: typescript_1.default.factory.createLogicalAnd,
                                positive: typescript_1.default.factory.createTrue(),
                                superfluous: () => typescript_1.default.factory.createFalse(),
                            },
                            context: props.context,
                            entries: v.entries,
                            input: v.input,
                        });
                    },
                array: (props) => typescript_1.default.factory.createCallExpression(IdentifierFactory_1.IdentifierFactory.access(props.input, "every"), undefined, [props.arrow]),
                failure: () => typescript_1.default.factory.createFalse(),
            },
            success: typescript_1.default.factory.createTrue(),
        });
    };
    IsProgrammer.decompose = (props) => {
        // CONFIGURATION
        const config = Object.assign(Object.assign({}, IsProgrammer.configure({
            options: {
                object: (v) => (0, check_object_1.check_object)({
                    config: {
                        equals: props.config.equals,
                        undefined: OptionPredicator_1.OptionPredicator.undefined(props.context.options),
                        assert: true,
                        reduce: typescript_1.default.factory.createLogicalAnd,
                        positive: typescript_1.default.factory.createTrue(),
                        superfluous: () => typescript_1.default.factory.createFalse(),
                    },
                    context: props.context,
                    entries: v.entries,
                    input: v.input,
                }),
                numeric: OptionPredicator_1.OptionPredicator.numeric(props.context.options),
            },
            context: props.context,
            functor: props.functor,
        })), { trace: props.config.equals });
        // COMPOSITION
        const composed = CheckerProgrammer_1.CheckerProgrammer.compose(Object.assign(Object.assign({}, props), { config }));
        return {
            functions: composed.functions,
            statements: composed.statements,
            arrow: typescript_1.default.factory.createArrowFunction(undefined, undefined, composed.parameters, composed.response, undefined, composed.body),
        };
    };
    IsProgrammer.write = (props) => {
        const functor = new FunctionProgrammer_1.FunctionProgrammer(props.modulo.getText());
        const result = IsProgrammer.decompose({
            config: props.config,
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
    IsProgrammer.write_function_statements = (props) => {
        const config = IsProgrammer.configure(props);
        const next = Object.assign(Object.assign({}, props), { config });
        const objects = CheckerProgrammer_1.CheckerProgrammer.write_object_functions(next);
        const unions = CheckerProgrammer_1.CheckerProgrammer.write_union_functions(next);
        const arrays = CheckerProgrammer_1.CheckerProgrammer.write_array_functions(next);
        const tuples = CheckerProgrammer_1.CheckerProgrammer.write_tuple_functions(next);
        return [
            ...objects.filter((_, i) => props.functor.hasLocal(`${config.prefix}o${i}`)),
            ...unions.filter((_, i) => props.functor.hasLocal(`${config.prefix}u${i}`)),
            ...arrays.filter((_, i) => props.functor.hasLocal(`${config.prefix}a${i}`)),
            ...tuples.filter((_, i) => props.functor.hasLocal(`${config.prefix}t${i}`)),
        ];
    };
    /* -----------------------------------------------------------
      DECODERS
    ----------------------------------------------------------- */
    IsProgrammer.decode = (props) => CheckerProgrammer_1.CheckerProgrammer.decode({
        context: props.context,
        config: IsProgrammer.configure(props),
        functor: props.functor,
        metadata: props.metadata,
        input: props.input,
        explore: props.explore,
    });
    IsProgrammer.decode_object = (props) => CheckerProgrammer_1.CheckerProgrammer.decode_object({
        config: IsProgrammer.configure(props),
        functor: props.functor,
        object: props.object,
        input: props.input,
        explore: props.explore,
    });
    IsProgrammer.decode_to_json = (props) => typescript_1.default.factory.createLogicalAnd(ExpressionFactory_1.ExpressionFactory.isObject({
        checkArray: false,
        checkNull: props.checkNull,
        input: props.input,
    }), typescript_1.default.factory.createStrictEquality(typescript_1.default.factory.createStringLiteral("function"), ValueFactory_1.ValueFactory.TYPEOF(IdentifierFactory_1.IdentifierFactory.access(props.input, "toJSON"))));
    IsProgrammer.decode_functional = (input) => typescript_1.default.factory.createStrictEquality(typescript_1.default.factory.createStringLiteral("function"), ValueFactory_1.ValueFactory.TYPEOF(input));
})(IsProgrammer || (exports.IsProgrammer = IsProgrammer = {}));
//# sourceMappingURL=IsProgrammer.js.map