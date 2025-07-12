"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeatureProgrammer = void 0;
const typescript_1 = __importDefault(require("typescript"));
const IdentifierFactory_1 = require("../factories/IdentifierFactory");
const StatementFactory_1 = require("../factories/StatementFactory");
const TypeFactory_1 = require("../factories/TypeFactory");
const ValueFactory_1 = require("../factories/ValueFactory");
const UnionExplorer_1 = require("./helpers/UnionExplorer");
const feature_object_entries_1 = require("./internal/feature_object_entries");
var FeatureProgrammer;
(function (FeatureProgrammer) {
    FeatureProgrammer.compose = (props) => {
        var _a, _b, _c, _d, _e, _f;
        const { collection, metadata } = props.config.initializer(props);
        return {
            body: props.config.decoder({
                input: ValueFactory_1.ValueFactory.INPUT(),
                metadata,
                explore: {
                    tracable: props.config.path || props.config.trace,
                    source: "top",
                    from: "top",
                    postfix: '""',
                },
            }),
            statements: props.config.addition
                ? props.config.addition(collection)
                : [],
            functions: Object.assign(Object.assign(Object.assign(Object.assign({}, Object.fromEntries(((_c = (_b = (_a = props.config.generator).objects) === null || _b === void 0 ? void 0 : _b.call(_a, collection)) !== null && _c !== void 0 ? _c : FeatureProgrammer.write_object_functions(Object.assign(Object.assign({}, props), { collection }))).map((v, i) => [`${props.config.prefix}o${i}`, v]))), Object.fromEntries(((_f = (_e = (_d = props.config.generator).unions) === null || _e === void 0 ? void 0 : _e.call(_d, collection)) !== null && _f !== void 0 ? _f : FeatureProgrammer.write_union_functions({
                config: props.config,
                collection,
            })).map((v, i) => [`${props.config.prefix}u${i}`, v]))), Object.fromEntries(props.config.generator
                .arrays(collection)
                .map((v, i) => [`${props.config.prefix}a${i}`, v]))), Object.fromEntries(props.config.generator
                .tuples(collection)
                .map((v, i) => [`${props.config.prefix}t${i}`, v]))),
            parameters: FeatureProgrammer.parameterDeclarations({
                config: props.config,
                type: props.config.types.input(props.type, props.name),
                input: ValueFactory_1.ValueFactory.INPUT(),
            }),
            response: props.config.types.output(props.type, props.name),
        };
    };
    FeatureProgrammer.writeDecomposed = (props) => typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createArrowFunction(undefined, undefined, [], undefined, undefined, typescript_1.default.factory.createBlock([
        ...props.functor.declare(),
        ...Object.entries(props.result.functions)
            .filter(([k]) => props.functor.hasLocal(k))
            .map(([_k, v]) => v),
        ...props.result.statements,
        typescript_1.default.factory.createReturnStatement(props.returnWrapper
            ? props.returnWrapper(props.result.arrow)
            : props.result.arrow),
    ])), undefined, undefined);
    FeatureProgrammer.write = (props) => {
        var _a, _b, _c, _d, _e, _f, _g;
        // ITERATE OVER ALL METADATA
        const { collection, metadata } = props.config.initializer(props);
        const output = props.config.decoder({
            metadata,
            input: ValueFactory_1.ValueFactory.INPUT(),
            explore: {
                tracable: props.config.path || props.config.trace,
                source: "top",
                from: "top",
                postfix: '""',
            },
        });
        // RETURNS THE OPTIMAL ARROW FUNCTION
        const functions = {
            objects: (_c = (_b = (_a = props.config.generator).objects) === null || _b === void 0 ? void 0 : _b.call(_a, collection)) !== null && _c !== void 0 ? _c : FeatureProgrammer.write_object_functions({
                config: props.config,
                context: props.context,
                collection,
            }),
            unions: (_f = (_e = (_d = props.config.generator).unions) === null || _e === void 0 ? void 0 : _e.call(_d, collection)) !== null && _f !== void 0 ? _f : FeatureProgrammer.write_union_functions({
                config: props.config,
                collection,
            }),
            arrays: props.config.generator.arrays(collection),
            tuples: props.config.generator.tuples(collection),
        };
        const added = ((_g = props.config.addition) !== null && _g !== void 0 ? _g : (() => []))(collection);
        return typescript_1.default.factory.createArrowFunction(undefined, undefined, FeatureProgrammer.parameterDeclarations({
            config: props.config,
            type: props.config.types.input(props.type, props.name),
            input: ValueFactory_1.ValueFactory.INPUT(),
        }), props.config.types.output(props.type, props.name), undefined, typescript_1.default.factory.createBlock([
            ...added,
            ...functions.objects.filter((_, i) => props.functor.hasLocal(`${props.config.prefix}o${i}`)),
            ...functions.unions.filter((_, i) => props.functor.hasLocal(`${props.config.prefix}u${i}`)),
            ...functions.arrays.filter((_, i) => props.functor.hasLocal(`${props.config.prefix}a${i}`)),
            ...functions.tuples.filter((_, i) => props.functor.hasLocal(`${props.config.prefix}t${i}`)),
            ...(typescript_1.default.isBlock(output)
                ? output.statements
                : [typescript_1.default.factory.createReturnStatement(output)]),
        ], true));
    };
    FeatureProgrammer.write_object_functions = (props) => props.collection.objects().map((object) => {
        var _a;
        return StatementFactory_1.StatementFactory.constant({
            name: `${props.config.prefix}o${object.index}`,
            value: typescript_1.default.factory.createArrowFunction(undefined, undefined, FeatureProgrammer.parameterDeclarations({
                config: props.config,
                type: TypeFactory_1.TypeFactory.keyword("any"),
                input: ValueFactory_1.ValueFactory.INPUT(),
            }), (_a = props.config.objector.type) !== null && _a !== void 0 ? _a : TypeFactory_1.TypeFactory.keyword("any"), undefined, props.config.objector.joiner({
                input: typescript_1.default.factory.createIdentifier("input"),
                entries: (0, feature_object_entries_1.feature_object_entries)({
                    config: props.config,
                    context: props.context,
                    input: typescript_1.default.factory.createIdentifier("input"),
                    object,
                }),
                object,
            })),
        });
    });
    FeatureProgrammer.write_union_functions = (props) => props.collection.unions().map((union, i) => StatementFactory_1.StatementFactory.constant({
        name: `${props.config.prefix}u${i}`,
        value: write_union({
            config: props.config,
            objects: union,
        }),
    }));
    const write_union = (props) => typescript_1.default.factory.createArrowFunction(undefined, undefined, FeatureProgrammer.parameterDeclarations({
        config: props.config,
        type: TypeFactory_1.TypeFactory.keyword("any"),
        input: ValueFactory_1.ValueFactory.INPUT(),
    }), TypeFactory_1.TypeFactory.keyword("any"), undefined, UnionExplorer_1.UnionExplorer.object({
        config: props.config,
        objects: props.objects,
        input: ValueFactory_1.ValueFactory.INPUT(),
        explore: {
            tracable: props.config.path || props.config.trace,
            source: "function",
            from: "object",
            postfix: "",
        },
    }));
    /* -----------------------------------------------------------
          DECODERS
      ----------------------------------------------------------- */
    FeatureProgrammer.decode_array = (props) => {
        var _a;
        const rand = props.functor.increment().toString();
        const tail = props.config.path || props.config.trace
            ? [
                IdentifierFactory_1.IdentifierFactory.parameter("_index" + rand, TypeFactory_1.TypeFactory.keyword("number")),
            ]
            : [];
        const arrow = typescript_1.default.factory.createArrowFunction(undefined, undefined, [
            IdentifierFactory_1.IdentifierFactory.parameter("elem", TypeFactory_1.TypeFactory.keyword("any")),
            ...tail,
        ], undefined, undefined, props.config.decoder({
            input: ValueFactory_1.ValueFactory.INPUT("elem"),
            metadata: props.array.type.value,
            explore: {
                tracable: props.explore.tracable,
                source: props.explore.source,
                from: "array",
                postfix: FeatureProgrammer.index({
                    start: (_a = props.explore.start) !== null && _a !== void 0 ? _a : null,
                    postfix: props.explore.postfix,
                    rand,
                }),
            },
        }));
        return props.combiner({
            input: props.input,
            arrow,
        });
    };
    FeatureProgrammer.decode_object = (props) => typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createIdentifier(props.functor.useLocal(`${props.config.prefix}o${props.object.index}`)), undefined, FeatureProgrammer.argumentsArray(props));
    /* -----------------------------------------------------------
          UTILITIES FOR INTERNAL FUNCTIONS
      ----------------------------------------------------------- */
    FeatureProgrammer.index = (props) => {
        const tail = props.start !== null
            ? `"[" + (${props.start} + _index${props.rand}) + "]"`
            : `"[" + _index${props.rand} + "]"`;
        if (props.postfix === "")
            return tail;
        else if (props.postfix[props.postfix.length - 1] === `"`)
            return (props.postfix.substring(0, props.postfix.length - 1) + tail.substring(1));
        return props.postfix + ` + ${tail}`;
    };
    FeatureProgrammer.argumentsArray = (props) => {
        const tail = props.config.path === false && props.config.trace === false
            ? []
            : props.config.path === true && props.config.trace === true
                ? [
                    typescript_1.default.factory.createIdentifier(props.explore.postfix
                        ? `_path + ${props.explore.postfix}`
                        : "_path"),
                    props.explore.source === "function"
                        ? typescript_1.default.factory.createIdentifier(`${props.explore.tracable} && _exceptionable`)
                        : props.explore.tracable
                            ? typescript_1.default.factory.createTrue()
                            : typescript_1.default.factory.createFalse(),
                ]
                : props.config.path === true
                    ? [
                        typescript_1.default.factory.createIdentifier(props.explore.postfix
                            ? `_path + ${props.explore.postfix}`
                            : "_path"),
                    ]
                    : [
                        props.explore.source === "function"
                            ? typescript_1.default.factory.createIdentifier(`${props.explore.tracable} && _exceptionable`)
                            : props.explore.tracable
                                ? typescript_1.default.factory.createTrue()
                                : typescript_1.default.factory.createFalse(),
                    ];
        return [props.input, ...tail];
    };
    FeatureProgrammer.parameterDeclarations = (props) => {
        const tail = [];
        if (props.config.path)
            tail.push(IdentifierFactory_1.IdentifierFactory.parameter("_path", TypeFactory_1.TypeFactory.keyword("string")));
        if (props.config.trace)
            tail.push(IdentifierFactory_1.IdentifierFactory.parameter("_exceptionable", TypeFactory_1.TypeFactory.keyword("boolean"), typescript_1.default.factory.createTrue()));
        return [IdentifierFactory_1.IdentifierFactory.parameter(props.input, props.type), ...tail];
    };
})(FeatureProgrammer || (exports.FeatureProgrammer = FeatureProgrammer = {}));
//# sourceMappingURL=FeatureProgrammer.js.map