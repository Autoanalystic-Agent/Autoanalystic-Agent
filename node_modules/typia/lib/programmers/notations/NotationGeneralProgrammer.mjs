import ts from 'typescript';
import { ExpressionFactory } from '../../factories/ExpressionFactory.mjs';
import { IdentifierFactory } from '../../factories/IdentifierFactory.mjs';
import { MetadataCollection } from '../../factories/MetadataCollection.mjs';
import { MetadataFactory } from '../../factories/MetadataFactory.mjs';
import { StatementFactory } from '../../factories/StatementFactory.mjs';
import { TypeFactory } from '../../factories/TypeFactory.mjs';
import { Metadata } from '../../schemas/metadata/Metadata.mjs';
import { MetadataArray } from '../../schemas/metadata/MetadataArray.mjs';
import { TransformerError } from '../../transformers/TransformerError.mjs';
import { StringUtil } from '../../utils/StringUtil.mjs';
import { FeatureProgrammer } from '../FeatureProgrammer.mjs';
import { IsProgrammer } from '../IsProgrammer.mjs';
import { FunctionProgrammer } from '../helpers/FunctionProgrammer.mjs';
import { NotationJoiner } from '../helpers/NotationJoiner.mjs';
import { UnionExplorer } from '../helpers/UnionExplorer.mjs';
import { decode_union_object } from '../internal/decode_union_object.mjs';
import { postfix_of_tuple } from '../internal/postfix_of_tuple.mjs';
import { wrap_metadata_rest_tuple } from '../internal/wrap_metadata_rest_tuple.mjs';

var NotationGeneralProgrammer;
(function (NotationGeneralProgrammer) {
    NotationGeneralProgrammer.returnType = (props) => props.context.importer.type({
        file: "typia",
        name: `${StringUtil.capitalize(props.rename.name)}Case`,
        arguments: [ts.factory.createTypeReferenceNode(props.type)],
    });
    NotationGeneralProgrammer.decompose = (props) => {
        const config = configure(props);
        if (props.validated === false)
            config.addition = (collection) => IsProgrammer.write_function_statements({
                context: props.context,
                functor: props.functor,
                collection,
            });
        const composed = FeatureProgrammer.compose({
            ...props,
            config,
        });
        return {
            functions: composed.functions,
            statements: composed.statements,
            arrow: ts.factory.createArrowFunction(undefined, undefined, composed.parameters, NotationGeneralProgrammer.returnType({
                rename: props.rename,
                context: props.context,
                type: props.name ??
                    TypeFactory.getFullName({
                        checker: props.context.checker,
                        type: props.type,
                    }),
            }), undefined, composed.body),
        };
    };
    NotationGeneralProgrammer.write = (props) => {
        const functor = new FunctionProgrammer(props.modulo.getText());
        const result = NotationGeneralProgrammer.decompose({
            ...props,
            functor,
            validated: true,
        });
        return FeatureProgrammer.writeDecomposed({
            functor,
            modulo: props.modulo,
            result,
        });
    };
    const write_array_functions = (props) => props.collection
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
    const write_tuple_functions = (props) => props.collection
        .tuples()
        .filter((t) => t.recursive)
        .map((tuple, i) => StatementFactory.constant({
        name: `${props.config.prefix}t${i}`,
        value: ts.factory.createArrowFunction(undefined, undefined, FeatureProgrammer.parameterDeclarations({
            config: props.config,
            type: TypeFactory.keyword("any"),
            input: ts.factory.createIdentifier("input"),
        }), TypeFactory.keyword("any"), undefined, decode_tuple_inline({
            ...props,
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
    /* -----------------------------------------------------------
          DECODERS
      ----------------------------------------------------------- */
    const decode = (props) => {
        // ANY TYPE
        if (props.metadata.any ||
            props.metadata.arrays.some((a) => a.type.value.any) ||
            props.metadata.tuples.some((t) => !!t.type.elements.length && t.type.elements.every((e) => e.any)))
            return ExpressionFactory.currying({
                function: props.context.importer.internal("notationAny"),
                arguments: [
                    props.context.importer.internal(`notation${StringUtil.capitalize(props.rename.name)}`),
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
                is: () => ts.factory.createStrictEquality(ts.factory.createStringLiteral("function"), ts.factory.createTypeOfExpression(props.input)),
                value: () => ts.factory.createIdentifier("undefined"),
            });
        // TUPLES
        for (const tuple of props.metadata.tuples)
            unions.push({
                type: "tuple",
                is: () => IsProgrammer.decode({
                    ...props,
                    metadata: (() => {
                        const partial = Metadata.initialize();
                        partial.tuples.push(tuple);
                        return partial;
                    })(),
                }),
                value: () => decode_tuple({
                    ...props,
                    tuple,
                }),
            });
        // ARRAYS
        if (props.metadata.arrays.length)
            unions.push({
                type: "array",
                is: () => ExpressionFactory.isArray(props.input),
                value: () => explore_arrays({
                    ...props,
                    arrays: props.metadata.arrays,
                    explore: {
                        ...props.explore,
                        from: "array",
                    },
                }),
            });
        // NATIVE TYPES
        if (props.metadata.sets.length)
            unions.push({
                type: "set",
                is: () => ExpressionFactory.isInstanceOf("Set", props.input),
                value: () => explore_sets({
                    ...props,
                    sets: props.metadata.sets,
                    explore: {
                        ...props.explore,
                        from: "array",
                    },
                }),
            });
        if (props.metadata.maps.length)
            unions.push({
                type: "map",
                is: () => ExpressionFactory.isInstanceOf("Map", props.input),
                value: () => explore_maps({
                    ...props,
                    maps: props.metadata.maps,
                    explore: {
                        ...props.explore,
                        from: "array",
                    },
                }),
            });
        for (const native of props.metadata.natives) {
            if (native.name === "WeakSet" || native.name === "WeakMap")
                continue;
            unions.push({
                type: "native",
                is: () => ExpressionFactory.isInstanceOf(native.name, props.input),
                value: () => native.name === "Boolean" ||
                    native.name === "Number" ||
                    native.name === "String"
                    ? ts.factory.createCallExpression(IdentifierFactory.access(props.input, "valueOf"), undefined, undefined)
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
                is: () => ExpressionFactory.isObject({
                    checkNull: true,
                    checkArray: false,
                    input: props.input,
                }),
                value: () => explore_objects({
                    ...props,
                    explore: {
                        ...props.explore,
                        from: "object",
                    },
                }),
            });
        // COMPOSITION
        if (unions.length === 0)
            return props.input;
        else if (unions.length === 1 && props.metadata.size() === 1) {
            const value = (props.metadata.nullable || props.metadata.isRequired() === false) &&
                is_instance(props.metadata)
                ? ts.factory.createConditionalExpression(props.input, undefined, unions[0].value(), undefined, props.input)
                : unions[0].value();
            return ts.factory.createAsExpression(value, TypeFactory.keyword("any"));
        }
        else {
            let last = props.input;
            for (const u of unions.reverse())
                last = ts.factory.createConditionalExpression(u.is(), undefined, u.value(), undefined, last);
            return ts.factory.createAsExpression(last, TypeFactory.keyword("any"));
        }
    };
    const decode_object = (props) => FeatureProgrammer.decode_object({
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
        ? ts.factory.createCallExpression(ts.factory.createIdentifier(props.functor.useLocal(`${props.config.prefix}a${props.array.type.index}`)), undefined, FeatureProgrammer.argumentsArray({
            config: props.config,
            explore: {
                ...props.explore,
                source: "function",
                from: "array",
            },
            input: props.input,
        }))
        : decode_array_inline(props);
    const decode_array_inline = (props) => FeatureProgrammer.decode_array({
        config: props.config,
        functor: props.functor,
        combiner: NotationJoiner.array,
        array: props.array,
        input: props.input,
        explore: props.explore,
    });
    const decode_tuple = (props) => props.tuple.type.recursive
        ? ts.factory.createCallExpression(ts.factory.createIdentifier(props.functor.useLocal(`${props.config.prefix}t${props.tuple.type.index}`)), undefined, FeatureProgrammer.argumentsArray({
            config: props.config,
            explore: {
                ...props.explore,
                source: "function",
            },
            input: props.input,
        }))
        : decode_tuple_inline({
            ...props,
            tuple: props.tuple.type,
        });
    const decode_tuple_inline = (props) => {
        const elements = props.tuple.elements
            .filter((m) => m.rest === null)
            .map((elem, index) => decode({
            ...props,
            input: ts.factory.createElementAccessExpression(props.input, index),
            metadata: elem,
            explore: {
                ...props.explore,
                from: "array",
                postfix: props.explore.postfix.length
                    ? `${postfix_of_tuple(props.explore.postfix)}[${index}]"`
                    : `"[${index}]"`,
            },
        }));
        const rest = (() => {
            if (props.tuple.elements.length === 0)
                return null;
            const last = props.tuple.elements.at(-1);
            const rest = last.rest;
            if (rest === null)
                return null;
            return decode({
                ...props,
                input: ts.factory.createCallExpression(IdentifierFactory.access(props.input, "slice"), undefined, [ExpressionFactory.number(props.tuple.elements.length - 1)]),
                metadata: wrap_metadata_rest_tuple(props.tuple.elements.at(-1).rest),
                explore: {
                    ...props.explore,
                    start: props.tuple.elements.length - 1,
                },
            });
        })();
        return NotationJoiner.tuple({
            elements,
            rest,
        });
    };
    /* -----------------------------------------------------------
          NATIVE CLASSES
      ----------------------------------------------------------- */
    const decode_native = (props) => props.name === "Date"
        ? ts.factory.createNewExpression(ts.factory.createIdentifier(props.name), undefined, [props.input])
        : props.input;
    /* -----------------------------------------------------------
          EXPLORERS FOR UNION TYPES
      ----------------------------------------------------------- */
    const explore_sets = (props) => ts.factory.createCallExpression(UnionExplorer.set({
        config: {
            checker: (v) => IsProgrammer.decode({
                context: props.context,
                functor: props.functor,
                input: v.input,
                metadata: v.definition,
                explore: v.explore,
            }),
            decoder: (v) => ts.factory.createNewExpression(ts.factory.createIdentifier("Set"), [TypeFactory.keyword("any")], [
                decode_array({
                    config: props.config,
                    functor: props.functor,
                    input: v.input,
                    array: v.definition,
                    explore: v.explore,
                }),
            ]),
            empty: ts.factory.createNewExpression(ts.factory.createIdentifier("Set"), [TypeFactory.keyword("any")], []),
            success: ts.factory.createTrue(),
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
    const explore_maps = (props) => ts.factory.createCallExpression(UnionExplorer.map({
        config: {
            checker: (v) => ts.factory.createLogicalAnd(IsProgrammer.decode({
                context: props.context,
                functor: props.functor,
                input: ts.factory.createElementAccessExpression(v.input, 0),
                metadata: v.definition[0],
                explore: {
                    ...props.explore,
                    postfix: `${v.explore.postfix}[0]`,
                },
            }), IsProgrammer.decode({
                context: props.context,
                functor: props.functor,
                input: ts.factory.createElementAccessExpression(v.input, 1),
                metadata: v.definition[1],
                explore: {
                    ...props.explore,
                    postfix: `${props.explore.postfix}[1]`,
                },
            })),
            decoder: (v) => ts.factory.createNewExpression(ts.factory.createIdentifier("Map"), [TypeFactory.keyword("any"), TypeFactory.keyword("any")], [
                decode_array({
                    config: props.config,
                    functor: props.functor,
                    input: v.input,
                    array: v.definition,
                    explore: v.explore,
                }),
            ]),
            empty: ts.factory.createNewExpression(ts.factory.createIdentifier("Map"), [TypeFactory.keyword("any"), TypeFactory.keyword("any")], []),
            success: ts.factory.createTrue(),
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
        return ts.factory.createCallExpression(ts.factory.createIdentifier(props.functor.useLocal(`${PREFIX}u${props.metadata.union_index}`)), undefined, FeatureProgrammer.argumentsArray(props));
    };
    const explore_arrays = (props) => explore_array_like_union_types({
        ...props,
        factory: (next) => UnionExplorer.array({
            config: {
                checker: (v) => IsProgrammer.decode({
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
                empty: ts.factory.createIdentifier("[]"),
                success: ts.factory.createTrue(),
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
        }),
        definitions: props.arrays,
        input: props.input,
        explore: props.explore,
    });
    const explore_array_like_union_types = (props) => {
        const arrow = (next) => props.factory({
            parameters: next.parameters,
            definitions: props.definitions,
            explore: next.explore,
            input: next.input,
        });
        if (props.definitions.every((e) => e.type.recursive === false))
            ts.factory.createCallExpression(arrow({
                parameters: [],
                explore: props.explore,
                input: props.input,
            }), undefined, []);
        const arrayExplore = {
            ...props.explore,
            source: "function",
            from: "array",
        };
        return ts.factory.createCallExpression(ts.factory.createIdentifier(props.functor.emplaceUnion(props.config.prefix, props.definitions.map((e) => e.type.name).join(" | "), () => arrow({
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
        }))), undefined, FeatureProgrammer.argumentsArray({
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
                input: (type, name) => ts.factory.createTypeReferenceNode(name ??
                    TypeFactory.getFullName({ checker: props.context.checker, type })),
                output: (type, name) => NotationGeneralProgrammer.returnType({
                    rename: props.rename,
                    context: props.context,
                    type: name ??
                        TypeFactory.getFullName({
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
                checker: (next) => IsProgrammer.decode({
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
                joiner: (next) => NotationJoiner.object({
                    rename: props.rename,
                    input: next.input,
                    entries: next.entries,
                }),
                unionizer: (next) => decode_union_object({
                    checker: (v) => IsProgrammer.decode_object({
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
        const collection = new MetadataCollection();
        const result = MetadataFactory.analyze({
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
            throw TransformerError.from({
                code: props.functor.method,
                errors: result.errors,
            });
        return {
            collection,
            metadata: result.data,
        };
    };
    const create_throw_error = (props) => ts.factory.createExpressionStatement(ts.factory.createCallExpression(props.context.importer.internal("throwTypeGuardError"), undefined, [
        ts.factory.createObjectLiteralExpression([
            ts.factory.createPropertyAssignment("method", ts.factory.createStringLiteral(props.functor.method)),
            ts.factory.createPropertyAssignment("expected", ts.factory.createStringLiteral(props.expected)),
            ts.factory.createPropertyAssignment("value", props.input),
        ], true),
    ]));
    const is_instance = (metadata) => !!metadata.objects.length ||
        !!metadata.arrays.length ||
        !!metadata.tuples.length ||
        !!metadata.sets.length ||
        !!metadata.maps.length ||
        !!metadata.natives.length ||
        (metadata.rest !== null && is_instance(metadata.rest));
})(NotationGeneralProgrammer || (NotationGeneralProgrammer = {}));

export { NotationGeneralProgrammer };
//# sourceMappingURL=NotationGeneralProgrammer.mjs.map
