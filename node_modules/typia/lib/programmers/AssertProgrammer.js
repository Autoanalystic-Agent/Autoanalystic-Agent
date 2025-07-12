"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssertProgrammer = void 0;
const typescript_1 = __importDefault(require("typescript"));
const IdentifierFactory_1 = require("../factories/IdentifierFactory");
const StatementFactory_1 = require("../factories/StatementFactory");
const TypeFactory_1 = require("../factories/TypeFactory");
const CheckerProgrammer_1 = require("./CheckerProgrammer");
const FeatureProgrammer_1 = require("./FeatureProgrammer");
const IsProgrammer_1 = require("./IsProgrammer");
const FunctionProgrammer_1 = require("./helpers/FunctionProgrammer");
const OptionPredicator_1 = require("./helpers/OptionPredicator");
const check_object_1 = require("./internal/check_object");
var AssertProgrammer;
(function (AssertProgrammer) {
    AssertProgrammer.decompose = (props) => {
        var _a, _b;
        const is = IsProgrammer_1.IsProgrammer.decompose(Object.assign(Object.assign({}, props), { config: {
                equals: props.config.equals,
            } }));
        const composed = CheckerProgrammer_1.CheckerProgrammer.compose(Object.assign(Object.assign({}, props), { config: {
                prefix: "_a",
                path: true,
                trace: true,
                numeric: OptionPredicator_1.OptionPredicator.numeric(props.context.options),
                equals: props.config.equals,
                atomist: (next) => [
                    ...(next.entry.expression ? [next.entry.expression] : []),
                    ...(next.entry.conditions.length === 0
                        ? []
                        : next.entry.conditions.length === 1
                            ? next.entry.conditions[0].map((cond) => typescript_1.default.factory.createLogicalOr(cond.expression, create_guard_call({
                                context: props.context,
                                functor: props.functor,
                                exceptionable: next.explore.from === "top"
                                    ? typescript_1.default.factory.createTrue()
                                    : typescript_1.default.factory.createIdentifier("_exceptionable"),
                                path: typescript_1.default.factory.createIdentifier(next.explore.postfix
                                    ? `_path + ${next.explore.postfix}`
                                    : "_path"),
                                expected: cond.expected,
                                input: next.input,
                            })))
                            : [
                                typescript_1.default.factory.createLogicalOr(next.entry.conditions
                                    .map((set) => set
                                    .map((s) => s.expression)
                                    .reduce((a, b) => typescript_1.default.factory.createLogicalAnd(a, b)))
                                    .reduce((a, b) => typescript_1.default.factory.createLogicalOr(a, b)), create_guard_call({
                                    context: props.context,
                                    functor: props.functor,
                                    exceptionable: next.explore.from === "top"
                                        ? typescript_1.default.factory.createTrue()
                                        : typescript_1.default.factory.createIdentifier("_exceptionable"),
                                    path: typescript_1.default.factory.createIdentifier(next.explore.postfix
                                        ? `_path + ${next.explore.postfix}`
                                        : "_path"),
                                    expected: next.entry.expected,
                                    input: next.input,
                                })),
                            ]),
                ].reduce((x, y) => typescript_1.default.factory.createLogicalAnd(x, y)),
                combiner: combiner(props),
                joiner: joiner(props),
                success: typescript_1.default.factory.createTrue(),
            } }));
        const arrow = typescript_1.default.factory.createArrowFunction(undefined, undefined, [
            IdentifierFactory_1.IdentifierFactory.parameter("input", TypeFactory_1.TypeFactory.keyword("any")),
            Guardian.parameter({
                context: props.context,
                init: props.init,
            }),
        ], props.config.guard
            ? typescript_1.default.factory.createTypePredicateNode(typescript_1.default.factory.createToken(typescript_1.default.SyntaxKind.AssertsKeyword), typescript_1.default.factory.createIdentifier("input"), typescript_1.default.factory.createTypeReferenceNode((_a = props.name) !== null && _a !== void 0 ? _a : TypeFactory_1.TypeFactory.getFullName({
                checker: props.context.checker,
                type: props.type,
            })))
            : typescript_1.default.factory.createTypeReferenceNode((_b = props.name) !== null && _b !== void 0 ? _b : TypeFactory_1.TypeFactory.getFullName({
                checker: props.context.checker,
                type: props.type,
            })), undefined, typescript_1.default.factory.createBlock([
            typescript_1.default.factory.createIfStatement(typescript_1.default.factory.createStrictEquality(typescript_1.default.factory.createFalse(), typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createIdentifier("__is"), undefined, [typescript_1.default.factory.createIdentifier("input")])), typescript_1.default.factory.createBlock([
                typescript_1.default.factory.createExpressionStatement(typescript_1.default.factory.createBinaryExpression(typescript_1.default.factory.createIdentifier("_errorFactory"), typescript_1.default.factory.createToken(typescript_1.default.SyntaxKind.EqualsToken), typescript_1.default.factory.createIdentifier("errorFactory"))),
                typescript_1.default.factory.createExpressionStatement(typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createArrowFunction(undefined, undefined, composed.parameters, undefined, undefined, composed.body), undefined, [
                    typescript_1.default.factory.createIdentifier("input"),
                    typescript_1.default.factory.createStringLiteral("$input"),
                    typescript_1.default.factory.createTrue(),
                ])),
            ], true), undefined),
            ...(props.config.guard === false
                ? [
                    typescript_1.default.factory.createReturnStatement(typescript_1.default.factory.createIdentifier(`input`)),
                ]
                : []),
        ], true));
        return {
            functions: Object.assign(Object.assign({}, is.functions), composed.functions),
            statements: [
                ...is.statements,
                ...composed.statements,
                StatementFactory_1.StatementFactory.constant({
                    name: "__is",
                    value: is.arrow,
                }),
                StatementFactory_1.StatementFactory.mut({
                    name: "_errorFactory",
                }),
            ],
            arrow,
        };
    };
    AssertProgrammer.write = (props) => {
        const functor = new FunctionProgrammer_1.FunctionProgrammer(props.modulo.getText());
        const result = AssertProgrammer.decompose(Object.assign(Object.assign({}, props), { functor }));
        return FeatureProgrammer_1.FeatureProgrammer.writeDecomposed({
            modulo: props.modulo,
            functor,
            result,
        });
    };
    const combiner = (props) => (next) => {
        if (next.explore.tracable === false)
            return IsProgrammer_1.IsProgrammer.configure({
                options: {
                    object: (v) => assert_object({
                        config: props.config,
                        context: props.context,
                        functor: props.functor,
                        entries: v.entries,
                        input: v.input,
                    }),
                    numeric: true,
                },
                context: props.context,
                functor: props.functor,
            }).combiner(next);
        const path = next.explore.postfix
            ? `_path + ${next.explore.postfix}`
            : "_path";
        return next.logic === "and"
            ? next.binaries
                .map((binary) => binary.combined
                ? binary.expression
                : typescript_1.default.factory.createLogicalOr(binary.expression, create_guard_call({
                    context: props.context,
                    functor: props.functor,
                    exceptionable: next.explore.source === "top"
                        ? typescript_1.default.factory.createTrue()
                        : typescript_1.default.factory.createIdentifier("_exceptionable"),
                    path: typescript_1.default.factory.createIdentifier(path),
                    expected: next.expected,
                    input: next.input,
                })))
                .reduce(typescript_1.default.factory.createLogicalAnd)
            : typescript_1.default.factory.createLogicalOr(next.binaries
                .map((binary) => binary.expression)
                .reduce(typescript_1.default.factory.createLogicalOr), create_guard_call({
                context: props.context,
                functor: props.functor,
                exceptionable: next.explore.source === "top"
                    ? typescript_1.default.factory.createTrue()
                    : typescript_1.default.factory.createIdentifier("_exceptionable"),
                path: typescript_1.default.factory.createIdentifier(path),
                expected: next.expected,
                input: next.input,
            }));
    };
    const assert_object = (props) => (0, check_object_1.check_object)({
        config: {
            equals: props.config.equals,
            assert: true,
            undefined: true,
            reduce: typescript_1.default.factory.createLogicalAnd,
            positive: typescript_1.default.factory.createTrue(),
            superfluous: (input) => create_guard_call({
                context: props.context,
                functor: props.functor,
                path: typescript_1.default.factory.createAdd(typescript_1.default.factory.createIdentifier("_path"), typescript_1.default.factory.createCallExpression(props.context.importer.internal("accessExpressionAsString"), undefined, [typescript_1.default.factory.createIdentifier("key")])),
                expected: "undefined",
                input,
            }),
            halt: (expr) => typescript_1.default.factory.createLogicalOr(typescript_1.default.factory.createStrictEquality(typescript_1.default.factory.createFalse(), typescript_1.default.factory.createIdentifier("_exceptionable")), expr),
        },
        context: props.context,
        entries: props.entries,
        input: props.input,
    });
    const joiner = (props) => ({
        object: (next) => assert_object({
            config: props.config,
            context: props.context,
            functor: props.functor,
            entries: next.entries,
            input: next.input,
        }),
        array: (props) => typescript_1.default.factory.createCallExpression(IdentifierFactory_1.IdentifierFactory.access(props.input, "every"), undefined, [props.arrow]),
        failure: (next) => {
            var _a, _b;
            return create_guard_call({
                context: props.context,
                functor: props.functor,
                exceptionable: ((_a = next.explore) === null || _a === void 0 ? void 0 : _a.from) === "top"
                    ? typescript_1.default.factory.createTrue()
                    : typescript_1.default.factory.createIdentifier("_exceptionable"),
                path: typescript_1.default.factory.createIdentifier(((_b = next.explore) === null || _b === void 0 ? void 0 : _b.postfix) ? `_path + ${next.explore.postfix}` : "_path"),
                expected: next.expected,
                input: next.input,
            });
        },
        full: props.config.equals
            ? undefined
            : (next) => typescript_1.default.factory.createLogicalOr(next.condition, create_guard_call({
                context: props.context,
                functor: props.functor,
                exceptionable: next.explore.from === "top"
                    ? typescript_1.default.factory.createTrue()
                    : typescript_1.default.factory.createIdentifier("_exceptionable"),
                path: typescript_1.default.factory.createIdentifier("_path"),
                expected: next.expected,
                input: next.input,
            })),
    });
    const create_guard_call = (props) => {
        var _a;
        return typescript_1.default.factory.createCallExpression(props.context.importer.internal("assertGuard"), undefined, [
            (_a = props.exceptionable) !== null && _a !== void 0 ? _a : typescript_1.default.factory.createIdentifier("_exceptionable"),
            typescript_1.default.factory.createObjectLiteralExpression([
                typescript_1.default.factory.createPropertyAssignment("method", typescript_1.default.factory.createStringLiteral(props.functor.method)),
                typescript_1.default.factory.createPropertyAssignment("path", props.path),
                typescript_1.default.factory.createPropertyAssignment("expected", typescript_1.default.factory.createStringLiteral(props.expected)),
                typescript_1.default.factory.createPropertyAssignment("value", props.input),
            ], true),
            typescript_1.default.factory.createIdentifier("_errorFactory"),
        ]);
    };
    let Guardian;
    (function (Guardian) {
        Guardian.identifier = () => typescript_1.default.factory.createIdentifier("errorFactory");
        Guardian.parameter = (props) => {
            var _a;
            return IdentifierFactory_1.IdentifierFactory.parameter("errorFactory", Guardian.type(props.context), (_a = props.init) !== null && _a !== void 0 ? _a : typescript_1.default.factory.createToken(typescript_1.default.SyntaxKind.QuestionToken));
        };
        Guardian.type = (context) => typescript_1.default.factory.createFunctionTypeNode(undefined, [
            typescript_1.default.factory.createParameterDeclaration(undefined, undefined, typescript_1.default.factory.createIdentifier("p"), undefined, context.importer.type({
                file: "typia",
                name: "TypeGuardError.IProps",
            }), undefined),
        ], typescript_1.default.factory.createTypeReferenceNode(typescript_1.default.factory.createIdentifier("Error"), undefined));
    })(Guardian = AssertProgrammer.Guardian || (AssertProgrammer.Guardian = {}));
})(AssertProgrammer || (exports.AssertProgrammer = AssertProgrammer = {}));
//# sourceMappingURL=AssertProgrammer.js.map