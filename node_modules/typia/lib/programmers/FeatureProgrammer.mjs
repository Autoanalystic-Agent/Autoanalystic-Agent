import ts from 'typescript';
import { IdentifierFactory } from '../factories/IdentifierFactory.mjs';
import { StatementFactory } from '../factories/StatementFactory.mjs';
import { TypeFactory } from '../factories/TypeFactory.mjs';
import { ValueFactory } from '../factories/ValueFactory.mjs';
import { UnionExplorer } from './helpers/UnionExplorer.mjs';
import { feature_object_entries } from './internal/feature_object_entries.mjs';

var FeatureProgrammer;
(function (FeatureProgrammer) {
    FeatureProgrammer.compose = (props) => {
        const { collection, metadata } = props.config.initializer(props);
        return {
            body: props.config.decoder({
                input: ValueFactory.INPUT(),
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
            functions: {
                ...Object.fromEntries((props.config.generator.objects?.(collection) ??
                    FeatureProgrammer.write_object_functions({
                        ...props,
                        collection,
                    })).map((v, i) => [`${props.config.prefix}o${i}`, v])),
                ...Object.fromEntries((props.config.generator.unions?.(collection) ??
                    FeatureProgrammer.write_union_functions({
                        config: props.config,
                        collection,
                    })).map((v, i) => [`${props.config.prefix}u${i}`, v])),
                ...Object.fromEntries(props.config.generator
                    .arrays(collection)
                    .map((v, i) => [`${props.config.prefix}a${i}`, v])),
                ...Object.fromEntries(props.config.generator
                    .tuples(collection)
                    .map((v, i) => [`${props.config.prefix}t${i}`, v])),
            },
            parameters: FeatureProgrammer.parameterDeclarations({
                config: props.config,
                type: props.config.types.input(props.type, props.name),
                input: ValueFactory.INPUT(),
            }),
            response: props.config.types.output(props.type, props.name),
        };
    };
    FeatureProgrammer.writeDecomposed = (props) => ts.factory.createCallExpression(ts.factory.createArrowFunction(undefined, undefined, [], undefined, undefined, ts.factory.createBlock([
        ...props.functor.declare(),
        ...Object.entries(props.result.functions)
            .filter(([k]) => props.functor.hasLocal(k))
            .map(([_k, v]) => v),
        ...props.result.statements,
        ts.factory.createReturnStatement(props.returnWrapper
            ? props.returnWrapper(props.result.arrow)
            : props.result.arrow),
    ])), undefined, undefined);
    FeatureProgrammer.write = (props) => {
        // ITERATE OVER ALL METADATA
        const { collection, metadata } = props.config.initializer(props);
        const output = props.config.decoder({
            metadata,
            input: ValueFactory.INPUT(),
            explore: {
                tracable: props.config.path || props.config.trace,
                source: "top",
                from: "top",
                postfix: '""',
            },
        });
        // RETURNS THE OPTIMAL ARROW FUNCTION
        const functions = {
            objects: props.config.generator.objects?.(collection) ??
                FeatureProgrammer.write_object_functions({
                    config: props.config,
                    context: props.context,
                    collection,
                }),
            unions: props.config.generator.unions?.(collection) ??
                FeatureProgrammer.write_union_functions({
                    config: props.config,
                    collection,
                }),
            arrays: props.config.generator.arrays(collection),
            tuples: props.config.generator.tuples(collection),
        };
        const added = (props.config.addition ?? (() => []))(collection);
        return ts.factory.createArrowFunction(undefined, undefined, FeatureProgrammer.parameterDeclarations({
            config: props.config,
            type: props.config.types.input(props.type, props.name),
            input: ValueFactory.INPUT(),
        }), props.config.types.output(props.type, props.name), undefined, ts.factory.createBlock([
            ...added,
            ...functions.objects.filter((_, i) => props.functor.hasLocal(`${props.config.prefix}o${i}`)),
            ...functions.unions.filter((_, i) => props.functor.hasLocal(`${props.config.prefix}u${i}`)),
            ...functions.arrays.filter((_, i) => props.functor.hasLocal(`${props.config.prefix}a${i}`)),
            ...functions.tuples.filter((_, i) => props.functor.hasLocal(`${props.config.prefix}t${i}`)),
            ...(ts.isBlock(output)
                ? output.statements
                : [ts.factory.createReturnStatement(output)]),
        ], true));
    };
    FeatureProgrammer.write_object_functions = (props) => props.collection.objects().map((object) => StatementFactory.constant({
        name: `${props.config.prefix}o${object.index}`,
        value: ts.factory.createArrowFunction(undefined, undefined, FeatureProgrammer.parameterDeclarations({
            config: props.config,
            type: TypeFactory.keyword("any"),
            input: ValueFactory.INPUT(),
        }), props.config.objector.type ?? TypeFactory.keyword("any"), undefined, props.config.objector.joiner({
            input: ts.factory.createIdentifier("input"),
            entries: feature_object_entries({
                config: props.config,
                context: props.context,
                input: ts.factory.createIdentifier("input"),
                object,
            }),
            object,
        })),
    }));
    FeatureProgrammer.write_union_functions = (props) => props.collection.unions().map((union, i) => StatementFactory.constant({
        name: `${props.config.prefix}u${i}`,
        value: write_union({
            config: props.config,
            objects: union,
        }),
    }));
    const write_union = (props) => ts.factory.createArrowFunction(undefined, undefined, FeatureProgrammer.parameterDeclarations({
        config: props.config,
        type: TypeFactory.keyword("any"),
        input: ValueFactory.INPUT(),
    }), TypeFactory.keyword("any"), undefined, UnionExplorer.object({
        config: props.config,
        objects: props.objects,
        input: ValueFactory.INPUT(),
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
        const rand = props.functor.increment().toString();
        const tail = props.config.path || props.config.trace
            ? [
                IdentifierFactory.parameter("_index" + rand, TypeFactory.keyword("number")),
            ]
            : [];
        const arrow = ts.factory.createArrowFunction(undefined, undefined, [
            IdentifierFactory.parameter("elem", TypeFactory.keyword("any")),
            ...tail,
        ], undefined, undefined, props.config.decoder({
            input: ValueFactory.INPUT("elem"),
            metadata: props.array.type.value,
            explore: {
                tracable: props.explore.tracable,
                source: props.explore.source,
                from: "array",
                postfix: FeatureProgrammer.index({
                    start: props.explore.start ?? null,
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
    FeatureProgrammer.decode_object = (props) => ts.factory.createCallExpression(ts.factory.createIdentifier(props.functor.useLocal(`${props.config.prefix}o${props.object.index}`)), undefined, FeatureProgrammer.argumentsArray(props));
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
                    ts.factory.createIdentifier(props.explore.postfix
                        ? `_path + ${props.explore.postfix}`
                        : "_path"),
                    props.explore.source === "function"
                        ? ts.factory.createIdentifier(`${props.explore.tracable} && _exceptionable`)
                        : props.explore.tracable
                            ? ts.factory.createTrue()
                            : ts.factory.createFalse(),
                ]
                : props.config.path === true
                    ? [
                        ts.factory.createIdentifier(props.explore.postfix
                            ? `_path + ${props.explore.postfix}`
                            : "_path"),
                    ]
                    : [
                        props.explore.source === "function"
                            ? ts.factory.createIdentifier(`${props.explore.tracable} && _exceptionable`)
                            : props.explore.tracable
                                ? ts.factory.createTrue()
                                : ts.factory.createFalse(),
                    ];
        return [props.input, ...tail];
    };
    FeatureProgrammer.parameterDeclarations = (props) => {
        const tail = [];
        if (props.config.path)
            tail.push(IdentifierFactory.parameter("_path", TypeFactory.keyword("string")));
        if (props.config.trace)
            tail.push(IdentifierFactory.parameter("_exceptionable", TypeFactory.keyword("boolean"), ts.factory.createTrue()));
        return [IdentifierFactory.parameter(props.input, props.type), ...tail];
    };
})(FeatureProgrammer || (FeatureProgrammer = {}));

export { FeatureProgrammer };
//# sourceMappingURL=FeatureProgrammer.mjs.map
