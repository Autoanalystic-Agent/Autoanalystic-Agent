import ts from 'typescript';
import { ExpressionFactory } from '../factories/ExpressionFactory.mjs';
import { IdentifierFactory } from '../factories/IdentifierFactory.mjs';
import { MetadataCollection } from '../factories/MetadataCollection.mjs';
import { MetadataFactory } from '../factories/MetadataFactory.mjs';
import { StatementFactory } from '../factories/StatementFactory.mjs';
import { TypeFactory } from '../factories/TypeFactory.mjs';
import { ValueFactory } from '../factories/ValueFactory.mjs';
import { MetadataArray } from '../schemas/metadata/MetadataArray.mjs';
import { MetadataTuple } from '../schemas/metadata/MetadataTuple.mjs';
import { TransformerError } from '../transformers/TransformerError.mjs';
import { FeatureProgrammer } from './FeatureProgrammer.mjs';
import { IsProgrammer } from './IsProgrammer.mjs';
import { AtomicPredicator } from './helpers/AtomicPredicator.mjs';
import { OptionPredicator } from './helpers/OptionPredicator.mjs';
import { UnionExplorer } from './helpers/UnionExplorer.mjs';
import { check_array_length } from './internal/check_array_length.mjs';
import { check_bigint } from './internal/check_bigint.mjs';
import { check_native } from './internal/check_native.mjs';
import { check_number } from './internal/check_number.mjs';
import { check_string } from './internal/check_string.mjs';
import { check_template } from './internal/check_template.mjs';
import { decode_union_object } from './internal/decode_union_object.mjs';
import { postfix_of_tuple } from './internal/postfix_of_tuple.mjs';
import { wrap_metadata_rest_tuple } from './internal/wrap_metadata_rest_tuple.mjs';

var CheckerProgrammer;
(function (CheckerProgrammer) {
    /* -----------------------------------------------------------
          WRITERS
      ----------------------------------------------------------- */
    CheckerProgrammer.compose = (props) => FeatureProgrammer.compose({
        ...props,
        config: configure(props),
    });
    CheckerProgrammer.write = (props) => FeatureProgrammer.write({
        config: configure(props),
        context: props.context,
        functor: props.functor,
        type: props.type,
        name: props.name,
    });
    CheckerProgrammer.write_object_functions = (props) => FeatureProgrammer.write_object_functions({
        config: configure(props),
        context: props.context,
        collection: props.collection,
    });
    CheckerProgrammer.write_union_functions = (props) => FeatureProgrammer.write_union_functions({
        config: configure({
            context: props.context,
            config: {
                ...props.config,
                numeric: false,
            },
            functor: props.functor,
        }),
        collection: props.collection,
    });
    CheckerProgrammer.write_array_functions = (props) => props.collection
        .arrays()
        .filter((a) => a.recursive)
        .map((type, i) => StatementFactory.constant({
        name: `${props.config.prefix}a${i}`,
        value: ts.factory.createArrowFunction(undefined, undefined, FeatureProgrammer.parameterDeclarations({
            config: props.config,
            type: TypeFactory.keyword("any"),
            input: ts.factory.createIdentifier("input"),
        }), TypeFactory.keyword("any"), undefined, decode_array_inline({
            ...props,
            input: ts.factory.createIdentifier("input"),
            array: MetadataArray.create({
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
    CheckerProgrammer.write_tuple_functions = (props) => props.collection
        .tuples()
        .filter((t) => t.recursive)
        .map((tuple, i) => StatementFactory.constant({
        name: `${props.config.prefix}t${i}`,
        value: ts.factory.createArrowFunction(undefined, undefined, FeatureProgrammer.parameterDeclarations({
            config: props.config,
            type: TypeFactory.keyword("any"),
            input: ts.factory.createIdentifier("input"),
        }), TypeFactory.keyword("any"), undefined, decode_tuple_inline({
            config: props.config,
            context: props.context,
            functor: props.functor,
            input: ts.factory.createIdentifier("input"),
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
            input: () => TypeFactory.keyword("any"),
            output: (type, name) => ts.factory.createTypePredicateNode(undefined, "input", ts.factory.createTypeReferenceNode(name ??
                TypeFactory.getFullName({ checker: props.context.checker, type }))),
        },
        trace: props.config.trace,
        path: props.config.path,
        prefix: props.config.prefix,
        initializer: (next) => {
            const collection = new MetadataCollection();
            const result = MetadataFactory.analyze({
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
                throw TransformerError.from({
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
                ? (next) => decode_union_object({
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
                        explore: {
                            ...v.explore,
                            tracable: true,
                        },
                    }),
                    success: props.config.joiner.is ?? ((expr) => expr),
                    escaper: (v) => ts.factory.createReturnStatement(props.config.joiner.failure(v)),
                    input: next.input,
                    objects: next.objects,
                    explore: next.explore,
                })
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
            failure: (next) => ts.factory.createReturnStatement(props.config.joiner.failure(next)),
            is: props.config.joiner.is,
            required: props.config.joiner.required,
            full: props.config.joiner.full
                ? (next) => props.config.joiner.full(next)
                : undefined,
            type: TypeFactory.keyword("boolean"),
        },
        generator: {
            unions: props.config.numeric
                ? (collection) => FeatureProgrammer.write_union_functions({
                    config: configure({
                        ...props,
                        config: {
                            ...props.config,
                            numeric: false,
                        },
                    }),
                    collection,
                })
                : undefined,
            arrays: (collection) => CheckerProgrammer.write_array_functions({
                ...props,
                collection,
            }),
            tuples: (collection) => CheckerProgrammer.write_tuple_functions({
                ...props,
                collection,
            }),
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
                return ts.factory.createStringLiteral(value);
            else if (typeof value === "bigint")
                return ExpressionFactory.bigint(value);
            return ts.factory.createIdentifier(value.toString());
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
                    left: ValueFactory.NULL(),
                });
            else
                create_add({
                    binaries: top,
                    default: props.input,
                    exact: props.metadata.nullable,
                    left: ValueFactory.NULL(),
                });
        // UNDEFINDABLE
        if (checkOptional || !props.metadata.isRequired())
            if (props.metadata.isRequired())
                create_add({
                    binaries: top,
                    default: props.input,
                    exact: false,
                    left: ValueFactory.UNDEFINED(),
                });
            else
                add({
                    exact: true,
                    left: ValueFactory.UNDEFINED(),
                });
        // FUNCTIONAL
        if (props.metadata.functions.length)
            if (OptionPredicator.functional(props.context.options) ||
                props.metadata.size() !== 1)
                add({
                    exact: true,
                    left: ts.factory.createStringLiteral("function"),
                    right: ValueFactory.TYPEOF(props.input),
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
        const constants = props.metadata.constants.filter((c) => AtomicPredicator.constant({
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
                left: ts.factory.createTrue(),
                right: ts.factory.createCallExpression(IdentifierFactory.access(props.functor.emplaceVariable(`${props.config.prefix}v${props.functor.increment()}`, ts.factory.createNewExpression(ts.factory.createIdentifier("Set"), undefined, [
                    ts.factory.createArrayLiteralExpression(values.map((v) => typeof v === "boolean"
                        ? v === true
                            ? ts.factory.createTrue()
                            : ts.factory.createFalse()
                        : typeof v === "bigint"
                            ? ExpressionFactory.bigint(v)
                            : typeof v === "number"
                                ? ExpressionFactory.number(v)
                                : ts.factory.createStringLiteral(v.toString()))),
                ])), "has"), undefined, [props.input]),
            });
        }
        else
            for (const c of constants)
                if (AtomicPredicator.constant({
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
            if (AtomicPredicator.atomic({
                metadata: props.metadata,
                name: atom.type,
            }) === false)
                continue;
            else if (atom.type === "number")
                binaries.push({
                    expression: props.config.atomist({
                        explore: props.explore,
                        entry: check_number({
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
                        entry: check_bigint({
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
                        entry: check_string({
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
                    left: ts.factory.createStringLiteral(atom.type),
                    right: ValueFactory.TYPEOF(props.input),
                });
        // TEMPLATE LITERAL VALUES
        if (props.metadata.templates.length)
            if (AtomicPredicator.template(props.metadata))
                binaries.push({
                    expression: props.config.atomist({
                        explore: props.explore,
                        entry: check_template({
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
                expression: check_native({
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
                head: check_native({
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
                    explore: {
                        ...props.explore,
                        from: "array",
                    },
                }));
        }
        // MAPS
        if (props.metadata.maps.length) {
            const install = (body) => prepare({
                head: check_native({
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
                    explore: {
                        ...props.explore,
                        from: "array",
                    },
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
                        expression: ExpressionFactory.isArray(props.input),
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
                        explore: {
                            ...props.explore,
                            from: "array",
                        },
                    }));
                // TUPLE ONLY
                else
                    install(explore_tuples({
                        config: props.config,
                        context: props.context,
                        functor: props.functor,
                        tuples: props.metadata.tuples,
                        input: props.input,
                        explore: {
                            ...props.explore,
                            from: "array",
                        },
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
                        explore: {
                            ...props.explore,
                            from: "array",
                        },
                    }));
                else
                    install(explore_arrays({
                        config: props.config,
                        context: props.context,
                        functor: props.functor,
                        arrays: props.metadata.arrays,
                        input: props.input,
                        explore: {
                            ...props.explore,
                            from: "array",
                        },
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
                head: ExpressionFactory.isObject({
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
                    explore: {
                        ...props.explore,
                        from: "object",
                    },
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
                        binaries: instances.map(transformer(ts.factory.createLogicalAnd)),
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
                    ? check_native({
                        name: props.metadata.escaped.original.natives[0].name,
                        input: props.input,
                    })
                    : ts.factory.createLogicalAnd(CheckerProgrammer.decode({
                        context: props.context,
                        config: props.config,
                        functor: props.functor,
                        metadata: props.metadata.escaped.original,
                        input: props.input,
                        explore: props.explore,
                    }), ts.factory.createLogicalAnd(IsProgrammer.decode_to_json({
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
        props.object.validated ||= true;
        return FeatureProgrammer.decode_object(props);
    };
    const decode_array = (props) => {
        if (props.array.type.recursive === false)
            return decode_array_inline(props);
        const arrayExplore = {
            ...props.explore,
            source: "function",
            from: "array",
        };
        return ts.factory.createLogicalOr(ts.factory.createCallExpression(ts.factory.createIdentifier(props.functor.useLocal(`${props.config.prefix}a${props.array.type.index}`)), undefined, FeatureProgrammer.argumentsArray({
            config: props.config,
            explore: {
                ...arrayExplore,
                source: "function",
                from: "array",
            },
            input: props.input,
        })), props.config.joiner.failure({
            input: props.input,
            expected: props.array.type.name,
            explore: arrayExplore,
        }));
    };
    const decode_array_inline = (props) => {
        const length = check_array_length({
            context: props.context,
            array: props.array,
            input: props.input,
        });
        const main = FeatureProgrammer.decode_array({
            config: {
                prefix: props.config.prefix,
                trace: props.config.trace,
                path: props.config.path,
                decoder: (next) => CheckerProgrammer.decode({
                    ...props,
                    ...next,
                }),
            },
            functor: props.functor,
            combiner: props.config.joiner.array,
            array: props.array,
            input: props.input,
            explore: props.explore,
        });
        return length.expression === null && length.conditions.length === 0
            ? main
            : ts.factory.createLogicalAnd(props.config.atomist({
                explore: props.explore,
                input: props.input,
                entry: length,
            }), main);
    };
    const decode_tuple = (props) => {
        if (props.tuple.type.recursive === false)
            return decode_tuple_inline({
                ...props,
                tuple: props.tuple.type,
            });
        const arrayExplore = {
            ...props.explore,
            source: "function",
            from: "array",
        };
        return ts.factory.createLogicalOr(ts.factory.createCallExpression(ts.factory.createIdentifier(props.functor.useLocal(`${props.config.prefix}t${props.tuple.type.index}`)), undefined, FeatureProgrammer.argumentsArray({
            config: props.config,
            explore: {
                ...arrayExplore,
                source: "function",
            },
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
            input: ts.factory.createElementAccessExpression(props.input, index),
            metadata,
            explore: {
                ...props.explore,
                from: "array",
                postfix: props.explore.postfix.length
                    ? `${postfix_of_tuple(props.explore.postfix)}[${index}]"`
                    : `"[${index}]"`,
            },
        }));
        const rest = props.tuple.elements.length && props.tuple.elements.at(-1).rest !== null
            ? CheckerProgrammer.decode({
                config: props.config,
                context: props.context,
                functor: props.functor,
                input: ts.factory.createCallExpression(IdentifierFactory.access(props.input, "slice"), undefined, [ExpressionFactory.number(props.tuple.elements.length - 1)]),
                metadata: wrap_metadata_rest_tuple(props.tuple.elements.at(-1).rest),
                explore: {
                    ...props.explore,
                    start: props.tuple.elements.length - 1,
                },
            })
            : null;
        const arrayLength = ts.factory.createPropertyAccessExpression(props.input, "length");
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
                                expression: ts.factory.createStrictEquality(arrayLength, ExpressionFactory.number(props.tuple.elements.length)),
                            },
                        ]
                        : [
                            {
                                combined: false,
                                expression: ts.factory.createLogicalAnd(ts.factory.createLessThanEquals(ExpressionFactory.number(props.tuple.elements.filter((t) => t.optional === false)
                                    .length), arrayLength), ts.factory.createGreaterThanEquals(ExpressionFactory.number(props.tuple.elements.length), arrayLength)),
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
    const decode_escaped = (props) => ts.factory.createCallExpression(ts.factory.createParenthesizedExpression(ts.factory.createArrowFunction(undefined, undefined, [IdentifierFactory.parameter("input", TypeFactory.keyword("any"))], undefined, undefined, CheckerProgrammer.decode({
        ...props,
        input: ts.factory.createIdentifier("input"),
    }))), undefined, [
        ts.factory.createCallExpression(IdentifierFactory.access(props.input, "toJSON"), undefined, []),
    ]);
    /* -----------------------------------------------------------
          UNION TYPE EXPLORERS
      ----------------------------------------------------------- */
    const explore_sets = (props) => ts.factory.createCallExpression(UnionExplorer.set({
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
            failure: (v) => ts.factory.createReturnStatement(props.config.joiner.failure(v)),
        },
        parameters: [],
        input: props.input,
        sets: props.sets,
        explore: props.explore,
    }), undefined, undefined);
    const explore_maps = (props) => ts.factory.createCallExpression(UnionExplorer.map({
        config: {
            checker: (v) => ts.factory.createLogicalAnd(CheckerProgrammer.decode({
                config: props.config,
                context: props.context,
                functor: props.functor,
                input: ts.factory.createElementAccessExpression(v.input, 0),
                metadata: v.definition[0],
                explore: {
                    ...v.explore,
                    postfix: `${v.explore.postfix}[0]`,
                },
            }), CheckerProgrammer.decode({
                config: props.config,
                context: props.context,
                functor: props.functor,
                input: ts.factory.createElementAccessExpression(v.input, 1),
                metadata: v.definition[1],
                explore: {
                    ...v.explore,
                    postfix: `${v.explore.postfix}[1]`,
                },
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
            failure: (v) => ts.factory.createReturnStatement(props.config.joiner.failure(v)),
        },
        parameters: [],
        input: props.input,
        maps: props.maps,
        explore: props.explore,
    }), undefined, undefined);
    const explore_tuples = (props) => explore_array_like_union_types({
        config: props.config,
        functor: props.functor,
        factory: (next) => UnionExplorer.tuple({
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
                failure: (v) => ts.factory.createReturnStatement(props.config.joiner.failure(v)),
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
        factory: (next) => UnionExplorer.array({
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
                failure: (v) => ts.factory.createReturnStatement(props.config.joiner.failure(v)),
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
        factory: (next) => UnionExplorer.array_or_tuple({
            config: {
                checker: (v) => v.definition instanceof MetadataTuple
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
                                .map((elem) => elem instanceof MetadataArray
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
                decoder: (v) => v.definition instanceof MetadataTuple
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
                failure: (v) => ts.factory.createReturnStatement(props.config.joiner.failure(v)),
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
            ts.factory.createCallExpression(arrow({
                explore: props.explore,
                input: props.input,
                parameters: [],
            }), undefined, []);
        const arrayExplore = {
            ...props.explore,
            source: "function",
            from: "array",
        };
        return ts.factory.createLogicalOr(ts.factory.createCallExpression(ts.factory.createIdentifier(props.functor.emplaceUnion(props.config.prefix, props.definitions.map((e) => e.type.name).join(" | "), () => arrow({
            parameters: FeatureProgrammer.parameterDeclarations({
                config: props.config,
                type: TypeFactory.keyword("any"),
                input: ts.factory.createIdentifier("input"),
            }),
            explore: {
                ...arrayExplore,
                postfix: "",
            },
            input: ts.factory.createIdentifier("input"),
        }))), undefined, FeatureProgrammer.argumentsArray(props)), props.config.joiner.failure({
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
        : ts.factory.createCallExpression(ts.factory.createIdentifier(props.functor.useLocal(`${props.config.prefix}u${props.metadata.union_index}`)), undefined, FeatureProgrammer.argumentsArray(props));
})(CheckerProgrammer || (CheckerProgrammer = {}));
const create_add = (props) => {
    const factory = props.exact
        ? ts.factory.createStrictEquality
        : ts.factory.createStrictInequality;
    props.binaries.push({
        expression: factory(props.left, props.right ?? props.default),
        combined: false,
    });
};

export { CheckerProgrammer };
//# sourceMappingURL=CheckerProgrammer.mjs.map
