"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonStringifyProgrammer = void 0;
const typescript_1 = __importDefault(require("typescript"));
const ExpressionFactory_1 = require("../../factories/ExpressionFactory");
const IdentifierFactory_1 = require("../../factories/IdentifierFactory");
const JsonMetadataFactory_1 = require("../../factories/JsonMetadataFactory");
const StatementFactory_1 = require("../../factories/StatementFactory");
const TypeFactory_1 = require("../../factories/TypeFactory");
const ValueFactory_1 = require("../../factories/ValueFactory");
const Metadata_1 = require("../../schemas/metadata/Metadata");
const MetadataArray_1 = require("../../schemas/metadata/MetadataArray");
const MetadataAtomic_1 = require("../../schemas/metadata/MetadataAtomic");
const FeatureProgrammer_1 = require("../FeatureProgrammer");
const IsProgrammer_1 = require("../IsProgrammer");
const AtomicPredicator_1 = require("../helpers/AtomicPredicator");
const FunctionProgrammer_1 = require("../helpers/FunctionProgrammer");
const OptionPredicator_1 = require("../helpers/OptionPredicator");
const StringifyJoinder_1 = require("../helpers/StringifyJoinder");
const StringifyPredicator_1 = require("../helpers/StringifyPredicator");
const UnionExplorer_1 = require("../helpers/UnionExplorer");
const check_native_1 = require("../internal/check_native");
const decode_union_object_1 = require("../internal/decode_union_object");
const postfix_of_tuple_1 = require("../internal/postfix_of_tuple");
const wrap_metadata_rest_tuple_1 = require("../internal/wrap_metadata_rest_tuple");
var JsonStringifyProgrammer;
(function (JsonStringifyProgrammer) {
    /* -----------------------------------------------------------
      WRITER
    ----------------------------------------------------------- */
    JsonStringifyProgrammer.decompose = (props) => {
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
            arrow: typescript_1.default.factory.createArrowFunction(undefined, undefined, composed.parameters, composed.response, undefined, composed.body),
        };
    };
    JsonStringifyProgrammer.write = (props) => {
        const functor = new FunctionProgrammer_1.FunctionProgrammer(props.modulo.getText());
        const result = JsonStringifyProgrammer.decompose(Object.assign(Object.assign({}, props), { validated: false, functor }));
        return FeatureProgrammer_1.FeatureProgrammer.writeDecomposed({
            modulo: props.modulo,
            functor,
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
        }), TypeFactory_1.TypeFactory.keyword("any"), undefined, decode_array_inline({
            config: props.config,
            functor: props.functor,
            input: typescript_1.default.factory.createIdentifier("input"),
            array: MetadataArray_1.MetadataArray.create({
                type,
                tags: [],
            }),
            explore: {
                tracable: props.config.trace,
                source: "function",
                from: "array",
                postfix: "",
            },
        })),
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
        }), TypeFactory_1.TypeFactory.keyword("any"), undefined, decode_tuple_inline({
            context: props.context,
            config: props.config,
            functor: props.functor,
            input: typescript_1.default.factory.createIdentifier("input"),
            tuple,
            explore: {
                tracable: props.config.trace,
                source: "function",
                from: "array",
                postfix: "",
            },
        })),
    }));
    /* -----------------------------------------------------------
      DECODERS
    ----------------------------------------------------------- */
    const decode = (props) => {
        var _a;
        // ANY TYPE
        if (props.metadata.any === true)
            return wrap_required({
                input: props.input,
                metadata: props.metadata,
                explore: props.explore,
                expression: wrap_functional({
                    input: props.input,
                    metadata: props.metadata,
                    explore: props.explore,
                    expression: typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createIdentifier("JSON.stringify"), undefined, [props.input]),
                }),
            });
        // ONLY NULL OR UNDEFINED
        const size = props.metadata.size();
        if (size === 0 &&
            (props.metadata.isRequired() === false ||
                props.metadata.nullable === true)) {
            if (props.metadata.isRequired() === false &&
                props.metadata.nullable === true)
                return props.explore.from === "array"
                    ? typescript_1.default.factory.createStringLiteral("null")
                    : typescript_1.default.factory.createConditionalExpression(typescript_1.default.factory.createStrictEquality(typescript_1.default.factory.createNull(), props.input), undefined, typescript_1.default.factory.createStringLiteral("null"), undefined, typescript_1.default.factory.createIdentifier("undefined"));
            else if (props.metadata.isRequired() === false)
                return props.explore.from === "array"
                    ? typescript_1.default.factory.createStringLiteral("null")
                    : typescript_1.default.factory.createIdentifier("undefined");
            else
                return typescript_1.default.factory.createStringLiteral("null");
        }
        //----
        // LIST UP UNION TYPES
        //----
        const unions = [];
        // toJSON() METHOD
        if (props.metadata.escaped !== null)
            unions.push({
                type: "resolved",
                is: props.metadata.escaped.original.size() === 1 &&
                    ((_a = props.metadata.escaped.original.natives[0]) === null || _a === void 0 ? void 0 : _a.name) === "Date"
                    ? () => (0, check_native_1.check_native)({
                        name: "Date",
                        input: props.input,
                    })
                    : () => IsProgrammer_1.IsProgrammer.decode_to_json({
                        checkNull: false,
                        input: props.input,
                    }),
                value: () => decode_to_json(Object.assign(Object.assign({}, props), { metadata: props.metadata.escaped.returns })),
            });
        else if (props.metadata.functions.length)
            unions.push({
                type: "functional",
                is: () => IsProgrammer_1.IsProgrammer.decode_functional(props.input),
                value: () => decode_functional(props.explore),
            });
        // TEMPLATES
        if (props.metadata.templates.length)
            if (AtomicPredicator_1.AtomicPredicator.template(props.metadata)) {
                const partial = Metadata_1.Metadata.initialize();
                partial.atomics.push(MetadataAtomic_1.MetadataAtomic.create({ type: "string", tags: [] })),
                    unions.push({
                        type: "template literal",
                        is: () => IsProgrammer_1.IsProgrammer.decode(Object.assign(Object.assign({}, props), { metadata: partial })),
                        value: () => decode_atomic(Object.assign(Object.assign({}, props), { type: "string" })),
                    });
            }
        // CONSTANTS
        for (const constant of props.metadata.constants)
            if (AtomicPredicator_1.AtomicPredicator.constant({
                metadata: props.metadata,
                name: constant.type,
            }) === false)
                continue;
            else if (constant.type !== "string")
                unions.push({
                    type: "atomic",
                    is: () => IsProgrammer_1.IsProgrammer.decode(Object.assign(Object.assign({}, props), { metadata: (() => {
                            const partial = Metadata_1.Metadata.initialize();
                            partial.atomics.push(MetadataAtomic_1.MetadataAtomic.create({
                                type: constant.type,
                                tags: [],
                            }));
                            return partial;
                        })() })),
                    value: () => decode_atomic(Object.assign(Object.assign({}, props), { type: constant.type })),
                });
            else if (props.metadata.templates.length === 0)
                unions.push({
                    type: "const string",
                    is: () => IsProgrammer_1.IsProgrammer.decode(Object.assign(Object.assign({}, props), { metadata: (() => {
                            const partial = Metadata_1.Metadata.initialize();
                            partial.atomics.push(MetadataAtomic_1.MetadataAtomic.create({
                                type: "string",
                                tags: [],
                            }));
                            return partial;
                        })() })),
                    value: () => decode_constant_string(Object.assign(Object.assign({}, props), { values: [...constant.values.map((v) => v.value)] })),
                });
        /// ATOMICS
        for (const a of props.metadata.atomics)
            if (AtomicPredicator_1.AtomicPredicator.atomic({
                metadata: props.metadata,
                name: a.type,
            }))
                unions.push({
                    type: "atomic",
                    is: () => IsProgrammer_1.IsProgrammer.decode(Object.assign(Object.assign({}, props), { metadata: (() => {
                            const partial = Metadata_1.Metadata.initialize();
                            partial.atomics.push(a);
                            return partial;
                        })() })),
                    value: () => decode_atomic(Object.assign(Object.assign({}, props), { type: a.type })),
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
        if (props.metadata.arrays.length) {
            const value = props.metadata.arrays.length === 1
                ? () => decode_array(Object.assign(Object.assign({}, props), { array: props.metadata.arrays[0], explore: Object.assign(Object.assign({}, props.explore), { from: "array" }) }))
                : props.metadata.arrays.some((elem) => elem.type.value.any)
                    ? () => typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createIdentifier("JSON.stringify"), undefined, [props.input])
                    : () => explore_arrays(Object.assign(Object.assign({}, props), { arrays: props.metadata.arrays, explore: Object.assign(Object.assign({}, props.explore), { from: "array" }) }));
            unions.push({
                type: "array",
                is: () => ExpressionFactory_1.ExpressionFactory.isArray(props.input),
                value,
            });
        }
        // BUILT-IN CLASSES
        if (props.metadata.natives.length)
            for (const native of props.metadata.natives)
                unions.push({
                    type: "object",
                    is: () => (0, check_native_1.check_native)({
                        name: native.name,
                        input: props.input,
                    }),
                    value: () => AtomicPredicator_1.AtomicPredicator.native(native.name)
                        ? decode_atomic(Object.assign(Object.assign({}, props), { type: native.name.toLowerCase() }))
                        : typescript_1.default.factory.createStringLiteral("{}"),
                });
        // SETS
        if (props.metadata.sets.length)
            unions.push({
                type: "object",
                is: () => ExpressionFactory_1.ExpressionFactory.isInstanceOf("Set", props.input),
                value: () => typescript_1.default.factory.createStringLiteral("{}"),
            });
        // MAPS
        if (props.metadata.maps.length)
            unions.push({
                type: "object",
                is: () => ExpressionFactory_1.ExpressionFactory.isInstanceOf("Map", props.input),
                value: () => typescript_1.default.factory.createStringLiteral("{}"),
            });
        // OBJECTS
        if (props.metadata.objects.length)
            unions.push({
                type: "object",
                is: () => ExpressionFactory_1.ExpressionFactory.isObject({
                    checkNull: true,
                    checkArray: props.metadata.objects.some((object) => object.type.properties.every((prop) => !prop.key.isSoleLiteral() || !prop.value.isRequired())),
                    input: props.input,
                }),
                value: () => explore_objects(Object.assign(Object.assign({}, props), { explore: Object.assign(Object.assign({}, props.explore), { from: "object" }) })),
            });
        //----
        // RETURNS
        //----
        // CHECK NULL AND UNDEFINED
        const wrapper = (output) => wrap_required({
            input: props.input,
            metadata: props.metadata,
            explore: props.explore,
            expression: wrap_nullable({
                input: props.input,
                metadata: props.metadata,
                expression: output,
            }),
        });
        // DIRECT RETURN
        if (unions.length === 0)
            return typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createIdentifier("JSON.stringify"), undefined, [props.input]);
        else if (unions.length === 1)
            return wrapper(unions[0].value());
        // RETURN WITH TYPE CHECKING
        return wrapper(typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createArrowFunction(undefined, undefined, [], undefined, undefined, iterate({
            context: props.context,
            functor: props.functor,
            input: props.input,
            expected: props.metadata.getName(),
            unions,
        })), undefined, undefined));
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
            input: props.input,
            explore: Object.assign(Object.assign({}, props.explore), { source: "function", from: "array" }),
        }))
        : decode_array_inline(props);
    const decode_array_inline = (props) => FeatureProgrammer_1.FeatureProgrammer.decode_array({
        config: props.config,
        functor: props.functor,
        combiner: StringifyJoinder_1.StringifyJoiner.array,
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
            .filter((elem) => elem.rest === null)
            .map((elem, index) => decode(Object.assign(Object.assign({}, props), { input: typescript_1.default.factory.createElementAccessExpression(props.input, index), metadata: elem, explore: Object.assign(Object.assign({}, props.explore), { from: "array", postfix: props.explore.postfix.length
                    ? `${(0, postfix_of_tuple_1.postfix_of_tuple)(props.explore.postfix)}[${index}]"`
                    : `"[${index}]"` }) })));
        const rest = (() => {
            if (props.tuple.elements.length === 0)
                return null;
            const last = props.tuple.elements.at(-1);
            if (last.rest === null)
                return null;
            const code = decode(Object.assign(Object.assign({}, props), { input: typescript_1.default.factory.createCallExpression(IdentifierFactory_1.IdentifierFactory.access(props.input, "slice"), undefined, [ExpressionFactory_1.ExpressionFactory.number(props.tuple.elements.length - 1)]), metadata: (0, wrap_metadata_rest_tuple_1.wrap_metadata_rest_tuple)(props.tuple.elements.at(-1).rest), explore: Object.assign(Object.assign({}, props.explore), { start: props.tuple.elements.length - 1 }) }));
            return typescript_1.default.factory.createCallExpression(props.context.importer.internal("jsonStringifyRest"), undefined, [code]);
        })();
        return StringifyJoinder_1.StringifyJoiner.tuple({
            elements,
            rest,
        });
    };
    const decode_atomic = (props) => {
        if (props.type === "string")
            return typescript_1.default.factory.createCallExpression(props.context.importer.internal("jsonStringifyString"), undefined, [props.input]);
        else if (props.type === "number" &&
            OptionPredicator_1.OptionPredicator.numeric(props.context.options))
            props = Object.assign(Object.assign({}, props), { input: typescript_1.default.factory.createCallExpression(props.context.importer.internal("jsonStringifyNumber"), undefined, [props.input]) });
        return props.explore.from !== "top"
            ? props.input
            : typescript_1.default.factory.createCallExpression(IdentifierFactory_1.IdentifierFactory.access(props.input, "toString"), undefined, undefined);
    };
    const decode_constant_string = (props) => {
        if (props.values.every((v) => !StringifyPredicator_1.StringifyPredicator.require_escape(v)))
            return [
                typescript_1.default.factory.createStringLiteral('"'),
                props.input,
                typescript_1.default.factory.createStringLiteral('"'),
            ].reduce((x, y) => typescript_1.default.factory.createAdd(x, y));
        return decode_atomic(Object.assign(Object.assign({}, props), { type: "string" }));
    };
    const decode_to_json = (props) => {
        return decode(Object.assign(Object.assign({}, props), { input: typescript_1.default.factory.createCallExpression(IdentifierFactory_1.IdentifierFactory.access(props.input, "toJSON"), undefined, []) }));
    };
    const decode_functional = (explore) => explore.from === "array"
        ? typescript_1.default.factory.createStringLiteral("null")
        : typescript_1.default.factory.createIdentifier("undefined");
    /* -----------------------------------------------------------
      EXPLORERS
    ----------------------------------------------------------- */
    const explore_objects = (props) => props.metadata.objects.length === 1
        ? decode_object({
            functor: props.functor,
            input: props.input,
            object: props.metadata.objects[0].type,
            explore: props.explore,
        })
        : typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createIdentifier(props.functor.useLocal(`${PREFIX}u${props.metadata.union_index}`)), undefined, FeatureProgrammer_1.FeatureProgrammer.argumentsArray(props));
    const explore_arrays = (props) => explore_array_like_union_types(Object.assign(Object.assign({}, props), { elements: props.arrays, factory: (next) => UnionExplorer_1.UnionExplorer.array({
            config: {
                checker: (v) => IsProgrammer_1.IsProgrammer.decode({
                    context: props.context,
                    functor: props.functor,
                    metadata: v.definition,
                    input: v.input,
                    explore: v.explore,
                }),
                decoder: (v) => decode_array({
                    config: props.config,
                    functor: props.functor,
                    input: v.input,
                    array: v.definition,
                    explore: v.explore,
                }),
                empty: typescript_1.default.factory.createStringLiteral("[]"),
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
        }) }));
    const explore_array_like_union_types = (props) => {
        const arrow = (next) => props.factory({
            definitions: props.elements,
            parameters: next.parameters,
            input: next.input,
            explore: next.explore,
        });
        if (props.elements.every((e) => e.type.recursive === false))
            typescript_1.default.factory.createCallExpression(arrow({
                parameters: [],
                explore: props.explore,
                input: props.input,
            }), undefined, []);
        const arrayExplore = Object.assign(Object.assign({}, props.explore), { source: "function", from: "array" });
        return typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createIdentifier(props.functor.emplaceUnion(props.config.prefix, props.elements.map((e) => e.type.name).join(" | "), () => arrow({
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
      RETURN SCRIPTS
    ----------------------------------------------------------- */
    const wrap_required = (props) => {
        if (props.metadata.isRequired() === true && props.metadata.any === false)
            return props.expression;
        return typescript_1.default.factory.createConditionalExpression(typescript_1.default.factory.createStrictInequality(typescript_1.default.factory.createIdentifier("undefined"), props.input), undefined, props.expression, undefined, props.explore.from === "array"
            ? typescript_1.default.factory.createStringLiteral("null")
            : typescript_1.default.factory.createIdentifier("undefined"));
    };
    const wrap_nullable = (props) => {
        if (props.metadata.nullable === false)
            return props.expression;
        return typescript_1.default.factory.createConditionalExpression(typescript_1.default.factory.createStrictInequality(typescript_1.default.factory.createNull(), props.input), undefined, props.expression, undefined, typescript_1.default.factory.createStringLiteral("null"));
    };
    const wrap_functional = (props) => {
        if (props.metadata.functions.length === 0)
            return props.expression;
        return typescript_1.default.factory.createConditionalExpression(typescript_1.default.factory.createStrictInequality(typescript_1.default.factory.createStringLiteral("function"), ValueFactory_1.ValueFactory.TYPEOF(props.input)), undefined, props.expression, undefined, decode_functional(props.explore));
    };
    const iterate = (props) => typescript_1.default.factory.createBlock([
        ...props.unions.map((u) => typescript_1.default.factory.createIfStatement(u.is(), typescript_1.default.factory.createReturnStatement(u.value()))),
        create_throw_error(props),
    ], true);
    /* -----------------------------------------------------------
      CONFIGURATIONS
    ----------------------------------------------------------- */
    const PREFIX = "_s";
    const configure = (props) => {
        const config = {
            types: {
                input: (type, name) => typescript_1.default.factory.createTypeReferenceNode(name !== null && name !== void 0 ? name : TypeFactory_1.TypeFactory.getFullName({ checker: props.context.checker, type })),
                output: () => TypeFactory_1.TypeFactory.keyword("string"),
            },
            prefix: PREFIX,
            trace: false,
            path: false,
            initializer,
            decoder: (next) => decode({
                context: props.context,
                functor: props.functor,
                config,
                metadata: next.metadata,
                input: next.input,
                explore: next.explore,
            }),
            objector: {
                checker: (next) => IsProgrammer_1.IsProgrammer.decode({
                    context: props.context,
                    functor: props.functor,
                    metadata: next.metadata,
                    input: next.input,
                    explore: next.explore,
                }),
                decoder: (next) => decode_object({
                    functor: props.functor,
                    input: next.input,
                    object: next.object,
                    explore: next.explore,
                }),
                joiner: (next) => StringifyJoinder_1.StringifyJoiner.object(Object.assign(Object.assign({}, next), { context: props.context })),
                unionizer: (next) => (0, decode_union_object_1.decode_union_object)({
                    checker: (v) => IsProgrammer_1.IsProgrammer.decode_object({
                        context: props.context,
                        functor: props.functor,
                        input: v.input,
                        object: v.object,
                        explore: v.explore,
                    }),
                    decoder: (v) => decode_object({
                        functor: props.functor,
                        input: v.input,
                        object: v.object,
                        explore: v.explore,
                    }),
                    success: (exp) => exp,
                    escaper: (v) => create_throw_error({
                        context: props.context,
                        functor: props.functor,
                        expected: v.expected,
                        input: v.input,
                    }),
                    objects: next.objects,
                    explore: next.explore,
                    input: next.input,
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
                    config,
                    functor: props.functor,
                    collection,
                }),
                tuples: (collection) => write_tuple_functions({
                    config,
                    context: props.context,
                    functor: props.functor,
                    collection,
                }),
            },
        };
        return config;
    };
    const initializer = (props) => JsonMetadataFactory_1.JsonMetadataFactory.analyze({
        method: props.functor.method,
        checker: props.context.checker,
        transformer: props.context.transformer,
        type: props.type,
    });
    const create_throw_error = (props) => typescript_1.default.factory.createExpressionStatement(typescript_1.default.factory.createCallExpression(props.context.importer.internal("throwTypeGuardError"), [], [
        typescript_1.default.factory.createObjectLiteralExpression([
            typescript_1.default.factory.createPropertyAssignment("method", typescript_1.default.factory.createStringLiteral(props.functor.method)),
            typescript_1.default.factory.createPropertyAssignment("expected", typescript_1.default.factory.createStringLiteral(props.expected)),
            typescript_1.default.factory.createPropertyAssignment("value", props.input),
        ], true),
    ]));
})(JsonStringifyProgrammer || (exports.JsonStringifyProgrammer = JsonStringifyProgrammer = {}));
//# sourceMappingURL=JsonStringifyProgrammer.js.map