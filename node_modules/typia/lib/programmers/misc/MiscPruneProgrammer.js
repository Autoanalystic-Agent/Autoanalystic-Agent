"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiscPruneProgrammer = void 0;
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
const FeatureProgrammer_1 = require("../FeatureProgrammer");
const IsProgrammer_1 = require("../IsProgrammer");
const FunctionProgrammer_1 = require("../helpers/FunctionProgrammer");
const PruneJoiner_1 = require("../helpers/PruneJoiner");
const UnionExplorer_1 = require("../helpers/UnionExplorer");
const decode_union_object_1 = require("../internal/decode_union_object");
const postfix_of_tuple_1 = require("../internal/postfix_of_tuple");
const wrap_metadata_rest_tuple_1 = require("../internal/wrap_metadata_rest_tuple");
var MiscPruneProgrammer;
(function (MiscPruneProgrammer) {
    MiscPruneProgrammer.decompose = (props) => {
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
    MiscPruneProgrammer.write = (props) => {
        const functor = new FunctionProgrammer_1.FunctionProgrammer(props.modulo.getText());
        const result = MiscPruneProgrammer.decompose(Object.assign(Object.assign({}, props), { validated: false, functor }));
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
        if (filter(props.metadata) === false)
            return typescript_1.default.factory.createBlock([]);
        const unions = [];
        //----
        // LIST UP UNION TYPES
        //----
        // TUPLES
        for (const tuple of props.metadata.tuples.filter((tuple) => tuple.type.elements.some((e) => { var _a; return filter((_a = e.rest) !== null && _a !== void 0 ? _a : e); })))
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
        if (props.metadata.arrays.filter((a) => filter(a.type.value)).length)
            unions.push({
                type: "array",
                is: () => ExpressionFactory_1.ExpressionFactory.isArray(props.input),
                value: () => explore_arrays(Object.assign(Object.assign({}, props), { arrays: props.metadata.arrays, explore: Object.assign(Object.assign({}, props.explore), { from: "array" }) })),
            });
        // BUILT-IN CLASSES
        if (props.metadata.natives.length)
            for (const native of props.metadata.natives)
                unions.push({
                    type: "native",
                    is: () => ExpressionFactory_1.ExpressionFactory.isInstanceOf(native.name, props.input),
                    value: () => typescript_1.default.factory.createReturnStatement(),
                });
        if (props.metadata.sets.length)
            unions.push({
                type: "set",
                is: () => ExpressionFactory_1.ExpressionFactory.isInstanceOf("Set", props.input),
                value: () => typescript_1.default.factory.createReturnStatement(),
            });
        if (props.metadata.maps.length)
            unions.push({
                type: "map",
                is: () => ExpressionFactory_1.ExpressionFactory.isInstanceOf("Map", props.input),
                value: () => typescript_1.default.factory.createReturnStatement(),
            });
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
        //----
        // STATEMENTS
        //----
        const converter = (v) => typescript_1.default.isReturnStatement(v) || typescript_1.default.isBlock(v)
            ? v
            : typescript_1.default.factory.createExpressionStatement(v);
        const statements = unions.map((u) => typescript_1.default.factory.createIfStatement(u.is(), converter(u.value())));
        return typescript_1.default.factory.createBlock(statements, true);
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
        combiner: PruneJoiner_1.PruneJoiner.array,
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
            .map((elem, index) => [elem, index])
            .filter(([elem]) => filter(elem) && elem.rest === null)
            .map(([elem, index]) => decode({
            context: props.context,
            config: props.config,
            functor: props.functor,
            input: typescript_1.default.factory.createElementAccessExpression(props.input, index),
            metadata: elem,
            explore: Object.assign(Object.assign({}, props.explore), { from: "array", postfix: props.explore.postfix.length
                    ? `${(0, postfix_of_tuple_1.postfix_of_tuple)(props.explore.postfix)}[${index}]"`
                    : `"[${index}]"` }),
        }));
        const rest = (() => {
            if (props.tuple.elements.length === 0)
                return null;
            const last = props.tuple.elements.at(-1);
            const rest = last.rest;
            if (rest === null || filter(rest) === false)
                return null;
            return decode({
                context: props.context,
                config: props.config,
                functor: props.functor,
                input: typescript_1.default.factory.createCallExpression(IdentifierFactory_1.IdentifierFactory.access(props.input, "slice"), undefined, [ExpressionFactory_1.ExpressionFactory.number(props.tuple.elements.length - 1)]),
                metadata: (0, wrap_metadata_rest_tuple_1.wrap_metadata_rest_tuple)(props.tuple.elements.at(-1).rest),
                explore: Object.assign(Object.assign({}, props.explore), { start: props.tuple.elements.length - 1 }),
            });
        })();
        return PruneJoiner_1.PruneJoiner.tuple({
            elements,
            rest,
        });
    };
    /* -----------------------------------------------------------
          UNION TYPE EXPLORERS
      ----------------------------------------------------------- */
    const explore_objects = (props) => {
        if (props.metadata.objects.length === 1)
            return decode_object(Object.assign(Object.assign({}, props), { object: props.metadata.objects[0].type }));
        return typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createIdentifier(props.functor.useLocal(`${PREFIX}u${props.metadata.union_index}`)), undefined, FeatureProgrammer_1.FeatureProgrammer.argumentsArray(props));
    };
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
    //(next.parameters)(next.input, next.elements, next.explore),
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
        }))), undefined, FeatureProgrammer_1.FeatureProgrammer.argumentsArray(props));
    };
    // @todo -> must filter out recursive visit
    const filter = (metadata) => metadata.any === false &&
        (metadata.objects.length !== 0 ||
            metadata.tuples.some((t) => !!t.type.elements.length &&
                t.type.elements.some((e) => { var _a; return filter((_a = e.rest) !== null && _a !== void 0 ? _a : e); })) ||
            metadata.arrays.some((e) => filter(e.type.value)));
    /* -----------------------------------------------------------
          CONFIGURATIONS
      ----------------------------------------------------------- */
    const PREFIX = "_p";
    const configure = (props) => {
        const config = {
            types: {
                input: (type, name) => typescript_1.default.factory.createTypeReferenceNode(name !== null && name !== void 0 ? name : TypeFactory_1.TypeFactory.getFullName({ checker: props.context.checker, type })),
                output: () => TypeFactory_1.TypeFactory.keyword("void"),
            },
            prefix: PREFIX,
            trace: false,
            path: false,
            initializer,
            decoder: (next) => decode({
                context: props.context,
                functor: props.functor,
                config,
                input: next.input,
                metadata: next.metadata,
                explore: next.explore,
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
                    input: next.input,
                    object: next.object,
                    explore: next.explore,
                }),
                joiner: PruneJoiner_1.PruneJoiner.object,
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
    const create_throw_error = (props) => typescript_1.default.factory.createExpressionStatement(typescript_1.default.factory.createCallExpression(props.context.importer.internal("throwTypeGuardError"), [], [
        typescript_1.default.factory.createObjectLiteralExpression([
            typescript_1.default.factory.createPropertyAssignment("method", typescript_1.default.factory.createStringLiteral(props.functor.method)),
            typescript_1.default.factory.createPropertyAssignment("expected", typescript_1.default.factory.createStringLiteral(props.expected)),
            typescript_1.default.factory.createPropertyAssignment("value", props.input),
        ], true),
    ]));
})(MiscPruneProgrammer || (exports.MiscPruneProgrammer = MiscPruneProgrammer = {}));
//# sourceMappingURL=MiscPruneProgrammer.js.map