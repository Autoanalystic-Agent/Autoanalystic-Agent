"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotationGeneralProgrammer = void 0;
const typescript_1 = __importDefault(require("typescript"));
const ExpressionFactory_1 = require("../../factories/ExpressionFactory");
const IdentifierFactory_1 = require("../../factories/IdentifierFactory");
const MetadataCollection_1 = require("../../factories/MetadataCollection");
const MetadataFactory_1 = require("../../factories/MetadataFactory");
const StatementFactory_1 = require("../../factories/StatementFactory");
const TypeFactory_1 = require("../../factories/TypeFactory");
const Metadata_1 = require("../../schemas/metadata/Metadata");
const MetadataArray_1 = require("../../schemas/metadata/MetadataArray");
const TransformerError_1 = require("../../transformers/TransformerError");
const StringUtil_1 = require("../../utils/StringUtil");
const FeatureProgrammer_1 = require("../FeatureProgrammer");
const IsProgrammer_1 = require("../IsProgrammer");
const FunctionProgrammer_1 = require("../helpers/FunctionProgrammer");
const NotationJoiner_1 = require("../helpers/NotationJoiner");
const UnionExplorer_1 = require("../helpers/UnionExplorer");
const decode_union_object_1 = require("../internal/decode_union_object");
const postfix_of_tuple_1 = require("../internal/postfix_of_tuple");
const wrap_metadata_rest_tuple_1 = require("../internal/wrap_metadata_rest_tuple");
var NotationGeneralProgrammer;
(function (NotationGeneralProgrammer) {
    NotationGeneralProgrammer.returnType = (props) => props.context.importer.type({
        file: "typia",
        name: `${StringUtil_1.StringUtil.capitalize(props.rename.name)}Case`,
        arguments: [typescript_1.default.factory.createTypeReferenceNode(props.type)],
    });
    NotationGeneralProgrammer.decompose = (props) => {
        var _a;
        const config = configure(props);
        if (props.validated === false)
            config.addition = (collection) => IsProgrammer_1.IsProgrammer.write_function_statements({
                context: props.context,
                functor: props.functor,
                collection,
            });
        const composed = FeatureProgrammer_1.FeatureProgrammer.compose(Object.assign(Object.assign({}, props), { config }));
        return {
            functions: composed.functions,
            statements: composed.statements,
            arrow: typescript_1.default.factory.createArrowFunction(undefined, undefined, composed.parameters, NotationGeneralProgrammer.returnType({
                rename: props.rename,
                context: props.context,
                type: (_a = props.name) !== null && _a !== void 0 ? _a : TypeFactory_1.TypeFactory.getFullName({
                    checker: props.context.checker,
                    type: props.type,
                }),
            }), undefined, composed.body),
        };
    };
    NotationGeneralProgrammer.write = (props) => {
        const functor = new FunctionProgrammer_1.FunctionProgrammer(props.modulo.getText());
        const result = NotationGeneralProgrammer.decompose(Object.assign(Object.assign({}, props), { functor, validated: true }));
        return FeatureProgrammer_1.FeatureProgrammer.writeDecomposed({
            functor,
            modulo: props.modulo,
            result,
        });
    };
    const write_array_functions = (props) => props.collection
        .arrays()
        .filter((a) => a.recursive)
        .map((type, i) => StatementFactory_1.StatementFactory.constant({
        name: `${props.config.prefix}a${i}`,
        value: typescript_1.default.factory.createArrowFunction(undefined, undefined, FeatureProgrammer_1.FeatureProgrammer.parameterDeclarations({
            config: props.config,
            type: TypeFactory_1.TypeFactory.keyword("any"),
            input: typescript_1.default.factory.createIdentifier("input"),
        }), TypeFactory_1.TypeFactory.keyword("any"), undefined, decode_array_inline(Object.assign(Object.assign({}, props), { input: typescript_1.default.factory.createIdentifier("input"), array: MetadataArray_1.MetadataArray.create({
                type,
                tags: [],
            }), explore: {
                tracable: props.config.trace,
                source: "function",
                from: "array",
                postfix: "",
            } }))),
    }));
    const write_tuple_functions = (props) => props.collection
        .tuples()
        .filter((t) => t.recursive)
        .map((tuple, i) => StatementFactory_1.StatementFactory.constant({
        name: `${props.config.prefix}t${i}`,
        value: typescript_1.default.factory.createArrowFunction(undefined, undefined, FeatureProgrammer_1.FeatureProgrammer.parameterDeclarations({
            config: props.config,
            type: TypeFactory_1.TypeFactory.keyword("any"),
            input: typescript_1.default.factory.createIdentifier("input"),
        }), TypeFactory_1.TypeFactory.keyword("any"), undefined, decode_tuple_inline(Object.assign(Object.assign({}, props), { input: typescript_1.default.factory.createIdentifier("input"), tuple, explore: {
                tracable: props.config.trace,
                source: "function",
                from: "array",
                postfix: "",
            } }))),
    }));
    /* -----------------------------------------------------------
          DECODERS
      ----------------------------------------------------------- */
    const decode = (props) => {
        // ANY TYPE
        if (props.metadata.any ||
            props.metadata.arrays.some((a) => a.type.value.any) ||
            props.metadata.tuples.some((t) => !!t.type.elements.length && t.type.elements.every((e) => e.any)))
            return ExpressionFactory_1.ExpressionFactory.currying({
                function: props.context.importer.internal("notationAny"),
                arguments: [
                    props.context.importer.internal(`notation${StringUtil_1.StringUtil.capitalize(props.rename.name)}`),
                    props.input,
                ],
            });
        const unions = [];
        //----
        // LIST UP UNION TYPES
        //----
        // FUNCTIONAL
        if (props.metadata.functions.length)
            unions.push({
                type: "functional",
                is: () => typescript_1.default.factory.createStrictEquality(typescript_1.default.factory.createStringLiteral("function"), typescript_1.default.factory.createTypeOfExpression(props.input)),
                value: () => typescript_1.default.factory.createIdentifier("undefined"),
            });
        // TUPLES
        for (const tuple of props.metadata.tuples)
            unions.push({
                type: "tuple",
                is: () => IsProgrammer_1.IsProgrammer.decode(Object.assign(Object.assign({}, props), { metadata: (() => {
                        const partial = Metadata_1.Metadata.initialize();
                        partial.tuples.push(tuple);
                        return partial;
                    })() })),
                value: () => decode_tuple(Object.assign(Object.assign({}, props), { tuple })),
            });
        // ARRAYS
        if (props.metadata.arrays.length)
            unions.push({
                type: "array",
                is: () => ExpressionFactory_1.ExpressionFactory.isArray(props.input),
                value: () => explore_arrays(Object.assign(Object.assign({}, props), { arrays: props.metadata.arrays, explore: Object.assign(Object.assign({}, props.explore), { from: "array" }) })),
            });
        // NATIVE TYPES
        if (props.metadata.sets.length)
            unions.push({
                type: "set",
                is: () => ExpressionFactory_1.ExpressionFactory.isInstanceOf("Set", props.input),
                value: () => explore_sets(Object.assign(Object.assign({}, props), { sets: props.metadata.sets, explore: Object.assign(Object.assign({}, props.explore), { from: "array" }) })),
            });
        if (props.metadata.maps.length)
            unions.push({
                type: "map",
                is: () => ExpressionFactory_1.ExpressionFactory.isInstanceOf("Map", props.input),
                value: () => explore_maps(Object.assign(Object.assign({}, props), { maps: props.metadata.maps, explore: Object.assign(Object.assign({}, props.explore), { from: "array" }) })),
            });
        for (const native of props.metadata.natives) {
            if (native.name === "WeakSet" || native.name === "WeakMap")
                continue;
            unions.push({
                type: "native",
                is: () => ExpressionFactory_1.ExpressionFactory.isInstanceOf(native.name, props.input),
                value: () => native.name === "Boolean" ||
                    native.name === "Number" ||
                    native.name === "String"
                    ? typescript_1.default.factory.createCallExpression(IdentifierFactory_1.IdentifierFactory.access(props.input, "valueOf"), undefined, undefined)
                    : decode_native({
                        name: native.name,
                        input: props.input,
                    }),
            });
        }
        // OBJECTS
        if (props.metadata.objects.length)
            unions.push({
                type: "object",
                is: () => ExpressionFactory_1.ExpressionFactory.isObject({
                    checkNull: true,
                    checkArray: false,
                    input: props.input,
                }),
                value: () => explore_objects(Object.assign(Object.assign({}, props), { explore: Object.assign(Object.assign({}, props.explore), { from: "object" }) })),
            });
        // COMPOSITION
        if (unions.length === 0)
            return props.input;
        else if (unions.length === 1 && props.metadata.size() === 1) {
            const value = (props.metadata.nullable || props.metadata.isRequired() === false) &&
                is_instance(props.metadata)
                ? typescript_1.default.factory.createConditionalExpression(props.input, undefined, unions[0].value(), undefined, props.input)
                : unions[0].value();
            return typescript_1.default.factory.createAsExpression(value, TypeFactory_1.TypeFactory.keyword("any"));
        }
        else {
            let last = props.input;
            for (const u of unions.reverse())
                last = typescript_1.default.factory.createConditionalExpression(u.is(), undefined, u.value(), undefined, last);
            return typescript_1.default.factory.createAsExpression(last, TypeFactory_1.TypeFactory.keyword("any"));
        }
    };
    const decode_object = (props) => FeatureProgrammer_1.FeatureProgrammer.decode_object({
        config: {
            trace: false,
            path: false,
            prefix: PREFIX,
        },
        functor: props.functor,
        object: props.object,
        input: props.input,
        explore: props.explore,
    });
    const decode_array = (props) => props.array.type.recursive
        ? typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createIdentifier(props.functor.useLocal(`${props.config.prefix}a${props.array.type.index}`)), undefined, FeatureProgrammer_1.FeatureProgrammer.argumentsArray({
            config: props.config,
            explore: Object.assign(Object.assign({}, props.explore), { source: "function", from: "array" }),
            input: props.input,
        }))
        : decode_array_inline(props);
    const decode_array_inline = (props) => FeatureProgrammer_1.FeatureProgrammer.decode_array({
        config: props.config,
        functor: props.functor,
        combiner: NotationJoiner_1.NotationJoiner.array,
        array: props.array,
        input: props.input,
        explore: props.explore,
    });
    const decode_tuple = (props) => props.tuple.type.recursive
        ? typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createIdentifier(props.functor.useLocal(`${props.config.prefix}t${props.tuple.type.index}`)), undefined, FeatureProgrammer_1.FeatureProgrammer.argumentsArray({
            config: props.config,
            explore: Object.assign(Object.assign({}, props.explore), { source: "function" }),
            input: props.input,
        }))
        : decode_tuple_inline(Object.assign(Object.assign({}, props), { tuple: props.tuple.type }));
    const decode_tuple_inline = (props) => {
        const elements = props.tuple.elements
            .filter((m) => m.rest === null)
            .map((elem, index) => decode(Object.assign(Object.assign({}, props), { input: typescript_1.default.factory.createElementAccessExpression(props.input, index), metadata: elem, explore: Object.assign(Object.assign({}, props.explore), { from: "array", postfix: props.explore.postfix.length
                    ? `${(0, postfix_of_tuple_1.postfix_of_tuple)(props.explore.postfix)}[${index}]"`
                    : `"[${index}]"` }) })));
        const rest = (() => {
            if (props.tuple.elements.length === 0)
                return null;
            const last = props.tuple.elements.at(-1);
            const rest = last.rest;
            if (rest === null)
                return null;
            return decode(Object.assign(Object.assign({}, props), { input: typescript_1.default.factory.createCallExpression(IdentifierFactory_1.IdentifierFactory.access(props.input, "slice"), undefined, [ExpressionFactory_1.ExpressionFactory.number(props.tuple.elements.length - 1)]), metadata: (0, wrap_metadata_rest_tuple_1.wrap_metadata_rest_tuple)(props.tuple.elements.at(-1).rest), explore: Object.assign(Object.assign({}, props.explore), { start: props.tuple.elements.length - 1 }) }));
        })();
        return NotationJoiner_1.NotationJoiner.tuple({
            elements,
            rest,
        });
    };
    /* -----------------------------------------------------------
          NATIVE CLASSES
      ----------------------------------------------------------- */
    const decode_native = (props) => props.name === "Date"
        ? typescript_1.default.factory.createNewExpression(typescript_1.default.factory.createIdentifier(props.name), undefined, [props.input])
        : props.input;
    /* -----------------------------------------------------------
          EXPLORERS FOR UNION TYPES
      ----------------------------------------------------------- */
    const explore_sets = (props) => typescript_1.default.factory.createCallExpression(UnionExplorer_1.UnionExplorer.set({
        config: {
            checker: (v) => IsProgrammer_1.IsProgrammer.decode({
                context: props.context,
                functor: props.functor,
                input: v.input,
                metadata: v.definition,
                explore: v.explore,
            }),
            decoder: (v) => typescript_1.default.factory.createNewExpression(typescript_1.default.factory.createIdentifier("Set"), [TypeFactory_1.TypeFactory.keyword("any")], [
                decode_array({
                    config: props.config,
                    functor: props.functor,
                    input: v.input,
                    array: v.definition,
                    explore: v.explore,
                }),
            ]),
            empty: typescript_1.default.factory.createNewExpression(typescript_1.default.factory.createIdentifier("Set"), [TypeFactory_1.TypeFactory.keyword("any")], []),
            success: typescript_1.default.factory.createTrue(),
            failure: (v) => create_throw_error({
                context: props.context,
                functor: props.functor,
                expected: v.expected,
                input: v.input,
            }),
        },
        parameters: [],
        input: props.input,
        sets: props.sets,
        explore: props.explore,
    }), undefined, undefined);
    const explore_maps = (props) => typescript_1.default.factory.createCallExpression(UnionExplorer_1.UnionExplorer.map({
        config: {
            checker: (v) => typescript_1.default.factory.createLogicalAnd(IsProgrammer_1.IsProgrammer.decode({
                context: props.context,
                functor: props.functor,
                input: typescript_1.default.factory.createElementAccessExpression(v.input, 0),
                metadata: v.definition[0],
                explore: Object.assign(Object.assign({}, props.explore), { postfix: `${v.explore.postfix}[0]` }),
            }), IsProgrammer_1.IsProgrammer.decode({
                context: props.context,
                functor: props.functor,
                input: typescript_1.default.factory.createElementAccessExpression(v.input, 1),
                metadata: v.definition[1],
                explore: Object.assign(Object.assign({}, props.explore), { postfix: `${props.explore.postfix}[1]` }),
            })),
            decoder: (v) => typescript_1.default.factory.createNewExpression(typescript_1.default.factory.createIdentifier("Map"), [TypeFactory_1.TypeFactory.keyword("any"), TypeFactory_1.TypeFactory.keyword("any")], [
                decode_array({
                    config: props.config,
                    functor: props.functor,
                    input: v.input,
                    array: v.definition,
                    explore: v.explore,
                }),
            ]),
            empty: typescript_1.default.factory.createNewExpression(typescript_1.default.factory.createIdentifier("Map"), [TypeFactory_1.TypeFactory.keyword("any"), TypeFactory_1.TypeFactory.keyword("any")], []),
            success: typescript_1.default.factory.createTrue(),
            failure: (v) => create_throw_error({
                context: props.context,
                functor: props.functor,
                expected: v.expected,
                input: v.input,
            }),
        },
        parameters: [],
        input: props.input,
        maps: props.maps,
        explore: props.explore,
    }), undefined, undefined);
    const explore_objects = (props) => {
        if (props.metadata.objects.length === 1)
            return decode_object({
                functor: props.functor,
                object: props.metadata.objects[0].type,
                input: props.input,
                explore: props.explore,
            });
        return typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createIdentifier(props.functor.useLocal(`${PREFIX}u${props.metadata.union_index}`)), undefined, FeatureProgrammer_1.FeatureProgrammer.argumentsArray(props));
    };
    const explore_arrays = (props) => explore_array_like_union_types(Object.assign(Object.assign({}, props), { factory: (next) => UnionExplorer_1.UnionExplorer.array({
            config: {
                checker: (v) => IsProgrammer_1.IsProgrammer.decode({
                    context: props.context,
                    functor: props.functor,
                    input: v.input,
                    metadata: v.definition,
                    explore: v.explore,
                }),
                decoder: (v) => decode_array({
                    config: props.config,
                    functor: props.functor,
                    input: v.input,
                    array: v.definition,
                    explore: v.explore,
                }),
                empty: typescript_1.default.factory.createIdentifier("[]"),
                success: typescript_1.default.factory.createTrue(),
                failure: (v) => create_throw_error({
                    context: props.context,
                    functor: props.functor,
                    expected: v.expected,
                    input: v.input,
                }),
            },
            parameters: next.parameters,
            input: next.input,
            arrays: next.definitions,
            explore: next.explore,
        }), definitions: props.arrays, input: props.input, explore: props.explore }));
    const explore_array_like_union_types = (props) => {
        const arrow = (next) => props.factory({
            parameters: next.parameters,
            definitions: props.definitions,
            explore: next.explore,
            input: next.input,
        });
        if (props.definitions.every((e) => e.type.recursive === false))
            typescript_1.default.factory.createCallExpression(arrow({
                parameters: [],
                explore: props.explore,
                input: props.input,
            }), undefined, []);
        const arrayExplore = Object.assign(Object.assign({}, props.explore), { source: "function", from: "array" });
        return typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createIdentifier(props.functor.emplaceUnion(props.config.prefix, props.definitions.map((e) => e.type.name).join(" | "), () => arrow({
            parameters: FeatureProgrammer_1.FeatureProgrammer.parameterDeclarations({
                config: props.config,
                type: TypeFactory_1.TypeFactory.keyword("any"),
                input: typescript_1.default.factory.createIdentifier("input"),
            }),
            explore: Object.assign(Object.assign({}, arrayExplore), { postfix: "" }),
            input: typescript_1.default.factory.createIdentifier("input"),
        }))), undefined, FeatureProgrammer_1.FeatureProgrammer.argumentsArray({
            config: props.config,
            explore: arrayExplore,
            input: props.input,
        }));
    };
    /* -----------------------------------------------------------
          CONFIGURATIONS
      ----------------------------------------------------------- */
    const PREFIX = "_c";
    const configure = (props) => {
        const config = {
            types: {
                input: (type, name) => typescript_1.default.factory.createTypeReferenceNode(name !== null && name !== void 0 ? name : TypeFactory_1.TypeFactory.getFullName({ checker: props.context.checker, type })),
                output: (type, name) => NotationGeneralProgrammer.returnType({
                    rename: props.rename,
                    context: props.context,
                    type: name !== null && name !== void 0 ? name : TypeFactory_1.TypeFactory.getFullName({
                        checker: props.context.checker,
                        type,
                    }),
                }),
            },
            prefix: PREFIX,
            trace: false,
            path: false,
            initializer,
            decoder: (next) => decode({
                config,
                rename: props.rename,
                context: props.context,
                functor: props.functor,
                metadata: next.metadata,
                explore: next.explore,
                input: next.input,
            }),
            objector: {
                checker: (next) => IsProgrammer_1.IsProgrammer.decode({
                    context: props.context,
                    functor: props.functor,
                    input: next.input,
                    metadata: next.metadata,
                    explore: next.explore,
                }),
                decoder: (next) => decode_object({
                    functor: props.functor,
                    object: next.object,
                    input: next.input,
                    explore: next.explore,
                }),
                joiner: (next) => NotationJoiner_1.NotationJoiner.object({
                    rename: props.rename,
                    input: next.input,
                    entries: next.entries,
                }),
                unionizer: (next) => (0, decode_union_object_1.decode_union_object)({
                    checker: (v) => IsProgrammer_1.IsProgrammer.decode_object({
                        context: props.context,
                        functor: props.functor,
                        object: v.object,
                        input: v.input,
                        explore: v.explore,
                    }),
                    decoder: (v) => decode_object({
                        functor: props.functor,
                        object: v.object,
                        input: v.input,
                        explore: v.explore,
                    }),
                    success: (exp) => exp,
                    escaper: (v) => create_throw_error({
                        context: props.context,
                        functor: props.functor,
                        expected: v.expected,
                        input: v.input,
                    }),
                    input: next.input,
                    objects: next.objects,
                    explore: next.explore,
                }),
                failure: (next) => create_throw_error({
                    context: props.context,
                    functor: props.functor,
                    expected: next.expected,
                    input: next.input,
                }),
            },
            generator: {
                arrays: (collection) => write_array_functions({
                    functor: props.functor,
                    config,
                    collection,
                }),
                tuples: (collection) => write_tuple_functions({
                    rename: props.rename,
                    context: props.context,
                    functor: props.functor,
                    config,
                    collection,
                }),
            },
        };
        return config;
    };
    const initializer = (props) => {
        const collection = new MetadataCollection_1.MetadataCollection();
        const result = MetadataFactory_1.MetadataFactory.analyze({
            checker: props.context.checker,
            transformer: props.context.transformer,
            options: {
                escape: false,
                constant: true,
                absorb: true,
            },
            collection,
            type: props.type,
        });
        if (result.success === false)
            throw TransformerError_1.TransformerError.from({
                code: props.functor.method,
                errors: result.errors,
            });
        return {
            collection,
            metadata: result.data,
        };
    };
    const create_throw_error = (props) => typescript_1.default.factory.createExpressionStatement(typescript_1.default.factory.createCallExpression(props.context.importer.internal("throwTypeGuardError"), undefined, [
        typescript_1.default.factory.createObjectLiteralExpression([
            typescript_1.default.factory.createPropertyAssignment("method", typescript_1.default.factory.createStringLiteral(props.functor.method)),
            typescript_1.default.factory.createPropertyAssignment("expected", typescript_1.default.factory.createStringLiteral(props.expected)),
            typescript_1.default.factory.createPropertyAssignment("value", props.input),
        ], true),
    ]));
    const is_instance = (metadata) => !!metadata.objects.length ||
        !!metadata.arrays.length ||
        !!metadata.tuples.length ||
        !!metadata.sets.length ||
        !!metadata.maps.length ||
        !!metadata.natives.length ||
        (metadata.rest !== null && is_instance(metadata.rest));
})(NotationGeneralProgrammer || (exports.NotationGeneralProgrammer = NotationGeneralProgrammer = {}));
//# sourceMappingURL=NotationGeneralProgrammer.js.map