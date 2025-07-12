"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckerProgrammer = void 0;
const typescript_1 = __importDefault(require("typescript"));
const ExpressionFactory_1 = require("../factories/ExpressionFactory");
const IdentifierFactory_1 = require("../factories/IdentifierFactory");
const MetadataCollection_1 = require("../factories/MetadataCollection");
const MetadataFactory_1 = require("../factories/MetadataFactory");
const StatementFactory_1 = require("../factories/StatementFactory");
const TypeFactory_1 = require("../factories/TypeFactory");
const ValueFactory_1 = require("../factories/ValueFactory");
const MetadataArray_1 = require("../schemas/metadata/MetadataArray");
const MetadataTuple_1 = require("../schemas/metadata/MetadataTuple");
const TransformerError_1 = require("../transformers/TransformerError");
const FeatureProgrammer_1 = require("./FeatureProgrammer");
const IsProgrammer_1 = require("./IsProgrammer");
const AtomicPredicator_1 = require("./helpers/AtomicPredicator");
const OptionPredicator_1 = require("./helpers/OptionPredicator");
const UnionExplorer_1 = require("./helpers/UnionExplorer");
const check_array_length_1 = require("./internal/check_array_length");
const check_bigint_1 = require("./internal/check_bigint");
const check_native_1 = require("./internal/check_native");
const check_number_1 = require("./internal/check_number");
const check_string_1 = require("./internal/check_string");
const check_template_1 = require("./internal/check_template");
const decode_union_object_1 = require("./internal/decode_union_object");
const postfix_of_tuple_1 = require("./internal/postfix_of_tuple");
const wrap_metadata_rest_tuple_1 = require("./internal/wrap_metadata_rest_tuple");
var CheckerProgrammer;
(function (CheckerProgrammer) {
    /* -----------------------------------------------------------
          WRITERS
      ----------------------------------------------------------- */
    CheckerProgrammer.compose = (props) => FeatureProgrammer_1.FeatureProgrammer.compose(Object.assign(Object.assign({}, props), { config: configure(props) }));
    CheckerProgrammer.write = (props) => FeatureProgrammer_1.FeatureProgrammer.write({
        config: configure(props),
        context: props.context,
        functor: props.functor,
        type: props.type,
        name: props.name,
    });
    CheckerProgrammer.write_object_functions = (props) => FeatureProgrammer_1.FeatureProgrammer.write_object_functions({
        config: configure(props),
        context: props.context,
        collection: props.collection,
    });
    CheckerProgrammer.write_union_functions = (props) => FeatureProgrammer_1.FeatureProgrammer.write_union_functions({
        config: configure({
            context: props.context,
            config: Object.assign(Object.assign({}, props.config), { numeric: false }),
            functor: props.functor,
        }),
        collection: props.collection,
    });
    CheckerProgrammer.write_array_functions = (props) => props.collection
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
    CheckerProgrammer.write_tuple_functions = (props) => props.collection
        .tuples()
        .filter((t) => t.recursive)
        .map((tuple, i) => StatementFactory_1.StatementFactory.constant({
        name: `${props.config.prefix}t${i}`,
        value: typescript_1.default.factory.createArrowFunction(undefined, undefined, FeatureProgrammer_1.FeatureProgrammer.parameterDeclarations({
            config: props.config,
            type: TypeFactory_1.TypeFactory.keyword("any"),
            input: typescript_1.default.factory.createIdentifier("input"),
        }), TypeFactory_1.TypeFactory.keyword("any"), undefined, decode_tuple_inline({
            config: props.config,
            context: props.context,
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
    const configure = (props) => ({
        types: {
            input: () => TypeFactory_1.TypeFactory.keyword("any"),
            output: (type, name) => typescript_1.default.factory.createTypePredicateNode(undefined, "input", typescript_1.default.factory.createTypeReferenceNode(name !== null && name !== void 0 ? name : TypeFactory_1.TypeFactory.getFullName({ checker: props.context.checker, type }))),
        },
        trace: props.config.trace,
        path: props.config.path,
        prefix: props.config.prefix,
        initializer: (next) => {
            const collection = new MetadataCollection_1.MetadataCollection();
            const result = MetadataFactory_1.MetadataFactory.analyze({
                checker: next.context.checker,
                transformer: next.context.transformer,
                options: {
                    escape: false,
                    constant: true,
                    absorb: true,
                },
                collection,
                type: next.type,
            });
            if (result.success === false)
                throw TransformerError_1.TransformerError.from({
                    code: next.functor.method,
                    errors: result.errors,
                });
            return {
                collection,
                metadata: result.data,
            };
        },
        addition: props.config.addition,
        decoder: props.config.decoder
            ? (next) => props.config.decoder(next)
            : (next) => CheckerProgrammer.decode({
                context: props.context,
                config: props.config,
                functor: props.functor,
                input: next.input,
                metadata: next.metadata,
                explore: next.explore,
            }),
        objector: {
            checker: props.config.decoder
                ? (next) => props.config.decoder(next)
                : (next) => CheckerProgrammer.decode({
                    context: props.context,
                    config: props.config,
                    functor: props.functor,
                    input: next.input,
                    metadata: next.metadata,
                    explore: next.explore,
                }),
            decoder: (next) => CheckerProgrammer.decode_object({
                config: props.config,
                functor: props.functor,
                input: next.input,
                object: next.object,
                explore: next.explore,
            }),
            joiner: props.config.joiner.object,
            unionizer: props.config.equals
                ? (next) => {
                    var _a;
                    return (0, decode_union_object_1.decode_union_object)({
                        checker: (v) => CheckerProgrammer.decode_object({
                            config: props.config,
                            functor: props.functor,
                            object: v.object,
                            input: v.input,
                            explore: v.explore,
                        }),
                        decoder: (v) => CheckerProgrammer.decode_object({
                            config: props.config,
                            functor: props.functor,
                            input: v.input,
                            object: v.object,
                            explore: Object.assign(Object.assign({}, v.explore), { tracable: true }),
                        }),
                        success: (_a = props.config.joiner.is) !== null && _a !== void 0 ? _a : ((expr) => expr),
                        escaper: (v) => typescript_1.default.factory.createReturnStatement(props.config.joiner.failure(v)),
                        input: next.input,
                        objects: next.objects,
                        explore: next.explore,
                    });
                }
                : (next) => props.config.combiner({
                    logic: "or",
                    explore: next.explore,
                    input: next.input,
                    binaries: next.objects.map((object) => ({
                        expression: CheckerProgrammer.decode_object({
                            config: props.config,
                            functor: props.functor,
                            object,
                            input: next.input,
                            explore: next.explore,
                        }),
                        combined: true,
                    })),
                    expected: `(${next.objects.map((t) => t.name).join(" | ")})`,
                }),
            failure: (next) => typescript_1.default.factory.createReturnStatement(props.config.joiner.failure(next)),
            is: props.config.joiner.is,
            required: props.config.joiner.required,
            full: props.config.joiner.full
                ? (next) => props.config.joiner.full(next)
                : undefined,
            type: TypeFactory_1.TypeFactory.keyword("boolean"),
        },
        generator: {
            unions: props.config.numeric
                ? (collection) => FeatureProgrammer_1.FeatureProgrammer.write_union_functions({
                    config: configure(Object.assign(Object.assign({}, props), { config: Object.assign(Object.assign({}, props.config), { numeric: false }) })),
                    collection,
                })
                : undefined,
            arrays: (collection) => CheckerProgrammer.write_array_functions(Object.assign(Object.assign({}, props), { collection })),
            tuples: (collection) => CheckerProgrammer.write_tuple_functions(Object.assign(Object.assign({}, props), { collection })),
        },
    });
    /* -----------------------------------------------------------
          DECODERS
      ----------------------------------------------------------- */
    CheckerProgrammer.decode = (props) => {
        if (props.metadata.any)
            return props.config.success;
        const top = [];
        const binaries = [];
        const add = (next) => create_add({
            binaries,
            left: next.left,
            right: next.right,
            exact: next.exact,
            default: props.input,
        });
        const getConstantValue = (value) => {
            if (typeof value === "string")
                return typescript_1.default.factory.createStringLiteral(value);
            else if (typeof value === "bigint")
                return ExpressionFactory_1.ExpressionFactory.bigint(value);
            return typescript_1.default.factory.createIdentifier(value.toString());
        };
        //----
        // CHECK OPTIONAL
        //----
        // @todo -> should be elaborated
        const checkOptional = props.metadata.empty() || props.metadata.isUnionBucket();
        // NULLABLE
        if (checkOptional || props.metadata.nullable)
            if (props.metadata.nullable)
                add({
                    exact: props.metadata.nullable,
                    left: ValueFactory_1.ValueFactory.NULL(),
                });
            else
                create_add({
                    binaries: top,
                    default: props.input,
                    exact: props.metadata.nullable,
                    left: ValueFactory_1.ValueFactory.NULL(),
                });
        // UNDEFINDABLE
        if (checkOptional || !props.metadata.isRequired())
            if (props.metadata.isRequired())
                create_add({
                    binaries: top,
                    default: props.input,
                    exact: false,
                    left: ValueFactory_1.ValueFactory.UNDEFINED(),
                });
            else
                add({
                    exact: true,
                    left: ValueFactory_1.ValueFactory.UNDEFINED(),
                });
        // FUNCTIONAL
        if (props.metadata.functions.length)
            if (OptionPredicator_1.OptionPredicator.functional(props.context.options) ||
                props.metadata.size() !== 1)
                add({
                    exact: true,
                    left: typescript_1.default.factory.createStringLiteral("function"),
                    right: ValueFactory_1.ValueFactory.TYPEOF(props.input),
                });
            else
                binaries.push({
                    combined: false,
                    expression: props.config.success,
                });
        //----
        // VALUES
        //----
        // CONSTANT VALUES
        const constants = props.metadata.constants.filter((c) => AtomicPredicator_1.AtomicPredicator.constant({
            metadata: props.metadata,
            name: c.type,
        }));
        const constantLength = constants
            .map((c) => c.values.length)
            .reduce((a, b) => a + b, 0);
        if (constantLength >= 10) {
            const values = constants
                .map((c) => c.values.map((v) => v.value))
                .flat();
            add({
                exact: true,
                left: typescript_1.default.factory.createTrue(),
                right: typescript_1.default.factory.createCallExpression(IdentifierFactory_1.IdentifierFactory.access(props.functor.emplaceVariable(`${props.config.prefix}v${props.functor.increment()}`, typescript_1.default.factory.createNewExpression(typescript_1.default.factory.createIdentifier("Set"), undefined, [
                    typescript_1.default.factory.createArrayLiteralExpression(values.map((v) => typeof v === "boolean"
                        ? v === true
                            ? typescript_1.default.factory.createTrue()
                            : typescript_1.default.factory.createFalse()
                        : typeof v === "bigint"
                            ? ExpressionFactory_1.ExpressionFactory.bigint(v)
                            : typeof v === "number"
                                ? ExpressionFactory_1.ExpressionFactory.number(v)
                                : typescript_1.default.factory.createStringLiteral(v.toString()))),
                ])), "has"), undefined, [props.input]),
            });
        }
        else
            for (const c of constants)
                if (AtomicPredicator_1.AtomicPredicator.constant({
                    metadata: props.metadata,
                    name: c.type,
                }))
                    for (const v of c.values)
                        add({
                            exact: true,
                            left: getConstantValue(v.value),
                        });
        // ATOMIC VALUES
        for (const atom of props.metadata.atomics)
            if (AtomicPredicator_1.AtomicPredicator.atomic({
                metadata: props.metadata,
                name: atom.type,
            }) === false)
                continue;
            else if (atom.type === "number")
                binaries.push({
                    expression: props.config.atomist({
                        explore: props.explore,
                        entry: (0, check_number_1.check_number)({
                            context: props.context,
                            numeric: props.config.numeric,
                            atomic: atom,
                            input: props.input,
                        }),
                        input: props.input,
                    }),
                    combined: false,
                });
            else if (atom.type === "bigint")
                binaries.push({
                    expression: props.config.atomist({
                        explore: props.explore,
                        entry: (0, check_bigint_1.check_bigint)({
                            context: props.context,
                            atomic: atom,
                            input: props.input,
                        }),
                        input: props.input,
                    }),
                    combined: false,
                });
            else if (atom.type === "string")
                binaries.push({
                    expression: props.config.atomist({
                        explore: props.explore,
                        entry: (0, check_string_1.check_string)({
                            context: props.context,
                            atomic: atom,
                            input: props.input,
                        }),
                        input: props.input,
                    }),
                    combined: false,
                });
            else
                add({
                    exact: true,
                    left: typescript_1.default.factory.createStringLiteral(atom.type),
                    right: ValueFactory_1.ValueFactory.TYPEOF(props.input),
                });
        // TEMPLATE LITERAL VALUES
        if (props.metadata.templates.length)
            if (AtomicPredicator_1.AtomicPredicator.template(props.metadata))
                binaries.push({
                    expression: props.config.atomist({
                        explore: props.explore,
                        entry: (0, check_template_1.check_template)({
                            templates: props.metadata.templates,
                            input: props.input,
                        }),
                        input: props.input,
                    }),
                    combined: false,
                });
        // NATIVE CLASSES
        for (const native of props.metadata.natives)
            binaries.push({
                expression: (0, check_native_1.check_native)({
                    name: native.name,
                    input: props.input,
                }),
                combined: false,
            });
        const instances = [];
        const prepare = (next) => instances.push(next);
        // SETS
        if (props.metadata.sets.length) {
            const install = (body) => prepare({
                head: (0, check_native_1.check_native)({
                    name: "Set",
                    input: props.input,
                }),
                expected: props.metadata.sets
                    .map((elem) => `Set<${elem.getName()}>`)
                    .join(" | "),
                body,
            });
            if (props.metadata.sets.some((elem) => elem.value.any))
                install(null);
            else
                install(explore_sets({
                    config: props.config,
                    context: props.context,
                    functor: props.functor,
                    sets: props.metadata.sets,
                    input: props.input,
                    explore: Object.assign(Object.assign({}, props.explore), { from: "array" }),
                }));
        }
        // MAPS
        if (props.metadata.maps.length) {
            const install = (body) => prepare({
                head: (0, check_native_1.check_native)({
                    name: "Map",
                    input: props.input,
                }),
                expected: props.metadata.maps
                    .map(({ key, value }) => `Map<${key}, ${value}>`)
                    .join(" | "),
                body,
            });
            if (props.metadata.maps.some((elem) => elem.key.any && elem.value.any))
                install(null);
            else
                install(explore_maps({
                    config: props.config,
                    context: props.context,
                    functor: props.functor,
                    maps: props.metadata.maps,
                    input: props.input,
                    explore: Object.assign(Object.assign({}, props.explore), { from: "array" }),
                }));
        }
        // ARRAYS AND TUPLES
        if (props.metadata.tuples.length + props.metadata.arrays.length > 0) {
            const install = (body) => prepare({
                head: props.config.atomist({
                    explore: props.explore,
                    entry: {
                        expected: [
                            ...props.metadata.tuples.map((t) => t.type.name),
                            ...props.metadata.arrays.map((a) => a.getName()),
                        ].join(" | "),
                        expression: ExpressionFactory_1.ExpressionFactory.isArray(props.input),
                        conditions: [],
                    },
                    input: props.input,
                }),
                expected: [...props.metadata.tuples, ...props.metadata.arrays]
                    .map((elem) => elem.type.name)
                    .join(" | "),
                body,
            });
            if (props.metadata.arrays.length === 0)
                if (props.metadata.tuples.length === 1)
                    install(decode_tuple({
                        config: props.config,
                        context: props.context,
                        functor: props.functor,
                        tuple: props.metadata.tuples[0],
                        input: props.input,
                        explore: Object.assign(Object.assign({}, props.explore), { from: "array" }),
                    }));
                // TUPLE ONLY
                else
                    install(explore_tuples({
                        config: props.config,
                        context: props.context,
                        functor: props.functor,
                        tuples: props.metadata.tuples,
                        input: props.input,
                        explore: Object.assign(Object.assign({}, props.explore), { from: "array" }),
                    }));
            else if (props.metadata.arrays.some((elem) => elem.type.value.any))
                install(null);
            else if (props.metadata.tuples.length === 0)
                if (props.metadata.arrays.length === 1)
                    // ARRAY ONLY
                    install(decode_array({
                        config: props.config,
                        context: props.context,
                        functor: props.functor,
                        array: props.metadata.arrays[0],
                        input: props.input,
                        explore: Object.assign(Object.assign({}, props.explore), { from: "array" }),
                    }));
                else
                    install(explore_arrays({
                        config: props.config,
                        context: props.context,
                        functor: props.functor,
                        arrays: props.metadata.arrays,
                        input: props.input,
                        explore: Object.assign(Object.assign({}, props.explore), { from: "array" }),
                    }));
            else
                install(explore_arrays_and_tuples({
                    config: props.config,
                    context: props.context,
                    functor: props.functor,
                    definitions: [...props.metadata.tuples, ...props.metadata.arrays],
                    input: props.input,
                    explore: props.explore,
                }));
        }
        // OBJECT
        if (props.metadata.objects.length > 0)
            prepare({
                head: ExpressionFactory_1.ExpressionFactory.isObject({
                    checkNull: true,
                    checkArray: props.metadata.objects.some((obj) => obj.type.properties.every((prop) => !prop.key.isSoleLiteral() || !prop.value.isRequired())),
                    input: props.input,
                }),
                expected: props.metadata.objects
                    .map((obj) => obj.type.name)
                    .join(" | "),
                body: explore_objects({
                    config: props.config,
                    functor: props.functor,
                    metadata: props.metadata,
                    input: props.input,
                    explore: Object.assign(Object.assign({}, props.explore), { from: "object" }),
                }),
            });
        if (instances.length) {
            const transformer = (merge) => (instance) => instance.body
                ? {
                    expression: merge(instance.head, instance.body),
                    combined: true,
                }
                : {
                    expression: instance.head,
                    combined: false,
                };
            if (instances.length === 1)
                binaries.push(transformer((head, body) => props.config.combiner({
                    explore: props.explore,
                    logic: "and",
                    input: props.input,
                    binaries: [head, body].map((expression) => ({
                        expression,
                        combined: expression !== head,
                    })),
                    expected: props.metadata.getName(),
                }))(instances[0]));
            else
                binaries.push({
                    expression: props.config.combiner({
                        explore: props.explore,
                        logic: "or",
                        input: props.input,
                        binaries: instances.map(transformer(typescript_1.default.factory.createLogicalAnd)),
                        expected: props.metadata.getName(),
                    }),
                    combined: true,
                });
        }
        // ESCAPED CASE
        if (props.metadata.escaped !== null)
            binaries.push({
                combined: false,
                expression: props.metadata.escaped.original.size() === 1 &&
                    props.metadata.escaped.original.natives.length === 1
                    ? (0, check_native_1.check_native)({
                        name: props.metadata.escaped.original.natives[0].name,
                        input: props.input,
                    })
                    : typescript_1.default.factory.createLogicalAnd(CheckerProgrammer.decode({
                        context: props.context,
                        config: props.config,
                        functor: props.functor,
                        metadata: props.metadata.escaped.original,
                        input: props.input,
                        explore: props.explore,
                    }), typescript_1.default.factory.createLogicalAnd(IsProgrammer_1.IsProgrammer.decode_to_json({
                        checkNull: false,
                        input: props.input,
                    }), decode_escaped({
                        config: props.config,
                        context: props.context,
                        functor: props.functor,
                        metadata: props.metadata.escaped.returns,
                        input: props.input,
                        explore: props.explore,
                    }))),
            });
        //----
        // COMBINE CONDITIONS
        //----
        return top.length && binaries.length
            ? props.config.combiner({
                explore: props.explore,
                logic: "and",
                input: props.input,
                binaries: [
                    ...top,
                    {
                        expression: props.config.combiner({
                            explore: props.explore,
                            logic: "or",
                            input: props.input,
                            binaries,
                            expected: props.metadata.getName(),
                        }),
                        combined: true,
                    },
                ],
                expected: props.metadata.getName(),
            })
            : binaries.length
                ? props.config.combiner({
                    explore: props.explore,
                    logic: "or",
                    input: props.input,
                    binaries,
                    expected: props.metadata.getName(),
                })
                : props.config.success;
    };
    CheckerProgrammer.decode_object = (props) => {
        var _a;
        (_a = props.object).validated || (_a.validated = true);
        return FeatureProgrammer_1.FeatureProgrammer.decode_object(props);
    };
    const decode_array = (props) => {
        if (props.array.type.recursive === false)
            return decode_array_inline(props);
        const arrayExplore = Object.assign(Object.assign({}, props.explore), { source: "function", from: "array" });
        return typescript_1.default.factory.createLogicalOr(typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createIdentifier(props.functor.useLocal(`${props.config.prefix}a${props.array.type.index}`)), undefined, FeatureProgrammer_1.FeatureProgrammer.argumentsArray({
            config: props.config,
            explore: Object.assign(Object.assign({}, arrayExplore), { source: "function", from: "array" }),
            input: props.input,
        })), props.config.joiner.failure({
            input: props.input,
            expected: props.array.type.name,
            explore: arrayExplore,
        }));
    };
    const decode_array_inline = (props) => {
        const length = (0, check_array_length_1.check_array_length)({
            context: props.context,
            array: props.array,
            input: props.input,
        });
        const main = FeatureProgrammer_1.FeatureProgrammer.decode_array({
            config: {
                prefix: props.config.prefix,
                trace: props.config.trace,
                path: props.config.path,
                decoder: (next) => CheckerProgrammer.decode(Object.assign(Object.assign({}, props), next)),
            },
            functor: props.functor,
            combiner: props.config.joiner.array,
            array: props.array,
            input: props.input,
            explore: props.explore,
        });
        return length.expression === null && length.conditions.length === 0
            ? main
            : typescript_1.default.factory.createLogicalAnd(props.config.atomist({
                explore: props.explore,
                input: props.input,
                entry: length,
            }), main);
    };
    const decode_tuple = (props) => {
        if (props.tuple.type.recursive === false)
            return decode_tuple_inline(Object.assign(Object.assign({}, props), { tuple: props.tuple.type }));
        const arrayExplore = Object.assign(Object.assign({}, props.explore), { source: "function", from: "array" });
        return typescript_1.default.factory.createLogicalOr(typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createIdentifier(props.functor.useLocal(`${props.config.prefix}t${props.tuple.type.index}`)), undefined, FeatureProgrammer_1.FeatureProgrammer.argumentsArray({
            config: props.config,
            explore: Object.assign(Object.assign({}, arrayExplore), { source: "function" }),
            input: props.input,
        })), props.config.joiner.failure({
            input: props.input,
            expected: props.tuple.type.name,
            explore: arrayExplore,
        }));
    };
    const decode_tuple_inline = (props) => {
        const binaries = props.tuple.elements
            .filter((metadata) => metadata.rest === null)
            .map((metadata, index) => CheckerProgrammer.decode({
            context: props.context,
            config: props.config,
            functor: props.functor,
            input: typescript_1.default.factory.createElementAccessExpression(props.input, index),
            metadata,
            explore: Object.assign(Object.assign({}, props.explore), { from: "array", postfix: props.explore.postfix.length
                    ? `${(0, postfix_of_tuple_1.postfix_of_tuple)(props.explore.postfix)}[${index}]"`
                    : `"[${index}]"` }),
        }));
        const rest = props.tuple.elements.length && props.tuple.elements.at(-1).rest !== null
            ? CheckerProgrammer.decode({
                config: props.config,
                context: props.context,
                functor: props.functor,
                input: typescript_1.default.factory.createCallExpression(IdentifierFactory_1.IdentifierFactory.access(props.input, "slice"), undefined, [ExpressionFactory_1.ExpressionFactory.number(props.tuple.elements.length - 1)]),
                metadata: (0, wrap_metadata_rest_tuple_1.wrap_metadata_rest_tuple)(props.tuple.elements.at(-1).rest),
                explore: Object.assign(Object.assign({}, props.explore), { start: props.tuple.elements.length - 1 }),
            })
            : null;
        const arrayLength = typescript_1.default.factory.createPropertyAccessExpression(props.input, "length");
        return props.config.combiner({
            explore: props.explore,
            logic: "and",
            input: props.input,
            binaries: [
                ...(rest === null
                    ? props.tuple.elements.every((t) => t.optional === false)
                        ? [
                            {
                                combined: false,
                                expression: typescript_1.default.factory.createStrictEquality(arrayLength, ExpressionFactory_1.ExpressionFactory.number(props.tuple.elements.length)),
                            },
                        ]
                        : [
                            {
                                combined: false,
                                expression: typescript_1.default.factory.createLogicalAnd(typescript_1.default.factory.createLessThanEquals(ExpressionFactory_1.ExpressionFactory.number(props.tuple.elements.filter((t) => t.optional === false)
                                    .length), arrayLength), typescript_1.default.factory.createGreaterThanEquals(ExpressionFactory_1.ExpressionFactory.number(props.tuple.elements.length), arrayLength)),
                            },
                        ]
                    : []),
                ...(props.config.joiner.tuple
                    ? [
                        {
                            expression: props.config.joiner.tuple(binaries),
                            combined: true,
                        },
                    ]
                    : binaries.map((expression) => ({
                        expression,
                        combined: true,
                    }))),
                ...(rest !== null
                    ? [
                        {
                            expression: rest,
                            combined: true,
                        },
                    ]
                    : []),
            ],
            expected: `[${props.tuple.elements.map((t) => t.getName()).join(", ")}]`,
        });
    };
    const decode_escaped = (props) => typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createParenthesizedExpression(typescript_1.default.factory.createArrowFunction(undefined, undefined, [IdentifierFactory_1.IdentifierFactory.parameter("input", TypeFactory_1.TypeFactory.keyword("any"))], undefined, undefined, CheckerProgrammer.decode(Object.assign(Object.assign({}, props), { input: typescript_1.default.factory.createIdentifier("input") })))), undefined, [
        typescript_1.default.factory.createCallExpression(IdentifierFactory_1.IdentifierFactory.access(props.input, "toJSON"), undefined, []),
    ]);
    /* -----------------------------------------------------------
          UNION TYPE EXPLORERS
      ----------------------------------------------------------- */
    const explore_sets = (props) => typescript_1.default.factory.createCallExpression(UnionExplorer_1.UnionExplorer.set({
        config: {
            checker: (v) => CheckerProgrammer.decode({
                context: props.context,
                config: props.config,
                functor: props.functor,
                input: v.input,
                metadata: v.definition,
                explore: v.explore,
            }),
            decoder: (v) => decode_array({
                config: props.config,
                context: props.context,
                functor: props.functor,
                array: v.definition,
                input: v.input,
                explore: v.explore,
            }),
            empty: props.config.success,
            success: props.config.success,
            failure: (v) => typescript_1.default.factory.createReturnStatement(props.config.joiner.failure(v)),
        },
        parameters: [],
        input: props.input,
        sets: props.sets,
        explore: props.explore,
    }), undefined, undefined);
    const explore_maps = (props) => typescript_1.default.factory.createCallExpression(UnionExplorer_1.UnionExplorer.map({
        config: {
            checker: (v) => typescript_1.default.factory.createLogicalAnd(CheckerProgrammer.decode({
                config: props.config,
                context: props.context,
                functor: props.functor,
                input: typescript_1.default.factory.createElementAccessExpression(v.input, 0),
                metadata: v.definition[0],
                explore: Object.assign(Object.assign({}, v.explore), { postfix: `${v.explore.postfix}[0]` }),
            }), CheckerProgrammer.decode({
                config: props.config,
                context: props.context,
                functor: props.functor,
                input: typescript_1.default.factory.createElementAccessExpression(v.input, 1),
                metadata: v.definition[1],
                explore: Object.assign(Object.assign({}, v.explore), { postfix: `${v.explore.postfix}[1]` }),
            })),
            decoder: (v) => decode_array({
                context: props.context,
                config: props.config,
                functor: props.functor,
                array: v.definition,
                input: v.input,
                explore: v.explore,
            }),
            empty: props.config.success,
            success: props.config.success,
            failure: (v) => typescript_1.default.factory.createReturnStatement(props.config.joiner.failure(v)),
        },
        parameters: [],
        input: props.input,
        maps: props.maps,
        explore: props.explore,
    }), undefined, undefined);
    const explore_tuples = (props) => explore_array_like_union_types({
        config: props.config,
        functor: props.functor,
        factory: (next) => UnionExplorer_1.UnionExplorer.tuple({
            config: {
                checker: (v) => decode_tuple({
                    context: props.context,
                    config: props.config,
                    functor: props.functor,
                    input: v.input,
                    tuple: v.definition,
                    explore: v.explore,
                }),
                decoder: (v) => decode_tuple({
                    context: props.context,
                    config: props.config,
                    functor: props.functor,
                    tuple: v.definition,
                    input: v.input,
                    explore: v.explore,
                }),
                empty: props.config.success,
                success: props.config.success,
                failure: (v) => typescript_1.default.factory.createReturnStatement(props.config.joiner.failure(v)),
            },
            parameters: next.parameters,
            tuples: next.definitions,
            input: next.input,
            explore: next.explore,
        }),
        definitions: props.tuples,
        input: props.input,
        explore: props.explore,
    });
    const explore_arrays = (props) => explore_array_like_union_types({
        config: props.config,
        functor: props.functor,
        factory: (next) => UnionExplorer_1.UnionExplorer.array({
            config: {
                checker: (v) => CheckerProgrammer.decode({
                    context: props.context,
                    config: props.config,
                    functor: props.functor,
                    metadata: v.definition,
                    input: v.input,
                    explore: v.explore,
                }),
                decoder: (v) => decode_array({
                    context: props.context,
                    config: props.config,
                    functor: props.functor,
                    array: v.definition,
                    input: v.input,
                    explore: v.explore,
                }),
                empty: props.config.success,
                success: props.config.success,
                failure: (v) => typescript_1.default.factory.createReturnStatement(props.config.joiner.failure(v)),
            },
            parameters: next.parameters,
            arrays: next.definitions,
            input: next.input,
            explore: next.explore,
        }),
        definitions: props.arrays,
        input: props.input,
        explore: props.explore,
    });
    const explore_arrays_and_tuples = (props) => explore_array_like_union_types({
        config: props.config,
        functor: props.functor,
        factory: (next) => UnionExplorer_1.UnionExplorer.array_or_tuple({
            config: {
                checker: (v) => v.definition instanceof MetadataTuple_1.MetadataTuple
                    ? decode_tuple({
                        config: props.config,
                        context: props.context,
                        functor: props.functor,
                        input: v.input,
                        tuple: v.definition,
                        explore: v.explore,
                    })
                    : props.config.atomist({
                        explore: v.explore,
                        entry: {
                            expected: props.definitions
                                .map((elem) => elem instanceof MetadataArray_1.MetadataArray
                                ? elem.getName()
                                : elem.type.name)
                                .join(" | "),
                            expression: CheckerProgrammer.decode({
                                functor: props.functor,
                                context: props.context,
                                config: props.config,
                                metadata: v.definition,
                                input: v.input,
                                explore: v.explore,
                            }),
                            conditions: [],
                        },
                        input: v.container,
                    }),
                decoder: (v) => v.definition instanceof MetadataTuple_1.MetadataTuple
                    ? decode_tuple({
                        context: props.context,
                        config: props.config,
                        functor: props.functor,
                        input: v.input,
                        tuple: v.definition,
                        explore: v.explore,
                    })
                    : decode_array({
                        context: props.context,
                        config: props.config,
                        functor: props.functor,
                        input: v.input,
                        array: v.definition,
                        explore: v.explore,
                    }),
                empty: props.config.success,
                success: props.config.success,
                failure: (v) => typescript_1.default.factory.createReturnStatement(props.config.joiner.failure(v)),
            },
            parameters: next.parameters,
            definitions: next.definitions,
            input: next.input,
            explore: next.explore,
        }),
        input: props.input,
        definitions: props.definitions,
        explore: props.explore,
    });
    const explore_array_like_union_types = (props) => {
        const arrow = (next) => props.factory({
            parameters: next.parameters,
            definitions: props.definitions,
            input: next.input,
            explore: next.explore,
        });
        if (props.definitions.every((e) => e.type.recursive === false))
            typescript_1.default.factory.createCallExpression(arrow({
                explore: props.explore,
                input: props.input,
                parameters: [],
            }), undefined, []);
        const arrayExplore = Object.assign(Object.assign({}, props.explore), { source: "function", from: "array" });
        return typescript_1.default.factory.createLogicalOr(typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createIdentifier(props.functor.emplaceUnion(props.config.prefix, props.definitions.map((e) => e.type.name).join(" | "), () => arrow({
            parameters: FeatureProgrammer_1.FeatureProgrammer.parameterDeclarations({
                config: props.config,
                type: TypeFactory_1.TypeFactory.keyword("any"),
                input: typescript_1.default.factory.createIdentifier("input"),
            }),
            explore: Object.assign(Object.assign({}, arrayExplore), { postfix: "" }),
            input: typescript_1.default.factory.createIdentifier("input"),
        }))), undefined, FeatureProgrammer_1.FeatureProgrammer.argumentsArray(props)), props.config.joiner.failure({
            input: props.input,
            expected: props.definitions.map((e) => e.type.name).join(" | "),
            explore: arrayExplore,
        }));
    };
    const explore_objects = (props) => props.metadata.objects.length === 1
        ? CheckerProgrammer.decode_object({
            config: props.config,
            functor: props.functor,
            object: props.metadata.objects[0].type,
            input: props.input,
            explore: props.explore,
        })
        : typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createIdentifier(props.functor.useLocal(`${props.config.prefix}u${props.metadata.union_index}`)), undefined, FeatureProgrammer_1.FeatureProgrammer.argumentsArray(props));
})(CheckerProgrammer || (exports.CheckerProgrammer = CheckerProgrammer = {}));
const create_add = (props) => {
    var _a;
    const factory = props.exact
        ? typescript_1.default.factory.createStrictEquality
        : typescript_1.default.factory.createStrictInequality;
    props.binaries.push({
        expression: factory(props.left, (_a = props.right) !== null && _a !== void 0 ? _a : props.default),
        combined: false,
    });
};
//# sourceMappingURL=CheckerProgrammer.js.map