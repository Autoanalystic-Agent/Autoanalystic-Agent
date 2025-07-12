import ts from 'typescript';
import { ExpressionFactory } from '../../factories/ExpressionFactory.mjs';
import { IdentifierFactory } from '../../factories/IdentifierFactory.mjs';
import { Metadata } from '../../schemas/metadata/Metadata.mjs';
import { MetadataArray } from '../../schemas/metadata/MetadataArray.mjs';
import { MetadataArrayType } from '../../schemas/metadata/MetadataArrayType.mjs';
import { MetadataTuple } from '../../schemas/metadata/MetadataTuple.mjs';
import { MetadataTupleType } from '../../schemas/metadata/MetadataTupleType.mjs';
import { check_union_array_like } from '../internal/check_union_array_like.mjs';
import { UnionPredicator } from './UnionPredicator.mjs';

var UnionExplorer;
(function (UnionExplorer) {
    /* -----------------------------------------------------------
          OBJECT
      ----------------------------------------------------------- */
    UnionExplorer.object = (props) => {
        // BREAKER
        if (props.objects.length === 1)
            return props.config.objector.decoder({
                input: props.input,
                object: props.objects[0],
                explore: props.explore,
            });
        const expected = `(${props.objects.map((t) => t.name).join(" | ")})`;
        // POSSIBLE TO SPECIALIZE?
        const specList = UnionPredicator.object(props.objects);
        if (specList.length === 0) {
            const condition = props.config.objector.unionizer({
                objects: props.objects,
                input: props.input,
                explore: {
                    ...props.explore,
                    tracable: false,
                },
            });
            return props.config.objector.full
                ? props.config.objector.full({
                    condition,
                    expected,
                    explore: props.explore,
                    input: props.input,
                })
                : condition;
        }
        const remained = props.objects.filter((t) => specList.find((s) => s.object === t) === undefined);
        // DO SPECIALIZE
        const condition = specList
            .filter((spec) => spec.property.key.getSoleLiteral() !== null)
            .map((spec, i, array) => {
            const key = spec.property.key.getSoleLiteral();
            const accessor = IdentifierFactory.access(props.input, key);
            const pred = spec.neighbor
                ? props.config.objector.checker({
                    input: accessor,
                    metadata: spec.property.value,
                    explore: {
                        ...props.explore,
                        tracable: false,
                        postfix: IdentifierFactory.postfix(key),
                    },
                })
                : (props.config.objector.required || ((exp) => exp))(ExpressionFactory.isRequired(accessor));
            return ts.factory.createIfStatement((props.config.objector.is || ((exp) => exp))(pred), ts.factory.createReturnStatement(props.config.objector.decoder({
                object: spec.object,
                input: props.input,
                explore: props.explore,
            })), i === array.length - 1
                ? remained.length
                    ? ts.factory.createReturnStatement(UnionExplorer.object({
                        config: props.config,
                        level: (props.level ?? 0) + 1,
                        input: props.input,
                        objects: remained,
                        explore: props.explore,
                    }))
                    : props.config.objector.failure({
                        input: props.input,
                        explore: props.explore,
                        expected,
                    })
                : undefined);
        })
            .reverse()
            .reduce((a, b) => ts.factory.createIfStatement(b.expression, b.thenStatement, a));
        // RETURNS WITH CONDITIONS
        return ts.factory.createCallExpression(ts.factory.createArrowFunction(undefined, undefined, [], undefined, undefined, ts.factory.createBlock([condition], true)), undefined, undefined);
    };
    /* -----------------------------------------------------------
          ARRAY LIKE
      ----------------------------------------------------------- */
    UnionExplorer.tuple = (props) => check_union_array_like({
        config: props.config,
        accessor: {
            transform: (x) => x,
            element: (x) => x,
            size: null,
            front: (input) => input,
            array: (input) => input,
            name: (t) => t.type.name,
        },
        parameters: props.parameters,
        input: props.input,
        definitions: props.tuples,
        explore: props.explore,
    });
    UnionExplorer.array = (props) => check_union_array_like({
        config: props.config,
        accessor: {
            transform: (x) => x,
            element: (x) => x.type.value,
            size: (input) => IdentifierFactory.access(input, "length"),
            front: (input) => ts.factory.createElementAccessExpression(input, 0),
            array: (input) => input,
            name: (t) => t.type.name,
        },
        parameters: props.parameters,
        input: props.input,
        definitions: props.arrays,
        explore: props.explore,
    });
    UnionExplorer.array_or_tuple = (props) => check_union_array_like({
        config: props.config,
        accessor: {
            transform: (x) => x,
            element: (x) => (x instanceof MetadataArray ? x.type.value : x),
            size: (input) => IdentifierFactory.access(input, "length"),
            front: (input) => ts.factory.createElementAccessExpression(input, 0),
            array: (input) => input,
            name: (m) => m.type.name,
        },
        parameters: props.parameters,
        input: props.input,
        definitions: props.definitions,
        explore: props.explore,
    });
    UnionExplorer.set = (props) => check_union_array_like({
        config: props.config,
        accessor: {
            transform: (value) => MetadataArray.create({
                tags: [],
                type: MetadataArrayType.create({
                    name: `Set<${value.getName()}>`,
                    index: null,
                    recursive: false,
                    nullables: [],
                    value,
                }),
            }),
            element: (array) => array.type.value,
            size: (input) => IdentifierFactory.access(input, "size"),
            front: (input) => IdentifierFactory.access(ts.factory.createCallExpression(IdentifierFactory.access(ts.factory.createCallExpression(IdentifierFactory.access(input, "values"), undefined, undefined), "next"), undefined, undefined), "value"),
            array: (input) => ts.factory.createArrayLiteralExpression([ts.factory.createSpreadElement(input)], false),
            name: (_m, e) => `Set<${e.getName()}>`,
        },
        parameters: props.parameters,
        input: props.input,
        definitions: props.sets.map((s) => s.value),
        explore: props.explore,
    });
    UnionExplorer.map = (props) => check_union_array_like({
        config: props.config,
        accessor: {
            element: (array) => array.type.value.tuples[0].type.elements,
            size: (input) => IdentifierFactory.access(input, "size"),
            front: (input) => IdentifierFactory.access(ts.factory.createCallExpression(IdentifierFactory.access(ts.factory.createCallExpression(IdentifierFactory.access(input, "entries"), undefined, undefined), "next"), undefined, undefined), "value"),
            array: (input) => ts.factory.createArrayLiteralExpression([ts.factory.createSpreadElement(input)], false),
            name: (_m, [k, v]) => `Map<${k.getName()}, ${v.getName()}>`,
            transform: (m) => MetadataArray.create({
                tags: [],
                type: MetadataArrayType.create({
                    name: `Map<${m.key.getName()}, ${m.value.getName()}>`,
                    index: null,
                    recursive: false,
                    nullables: [],
                    value: Metadata.create({
                        ...Metadata.initialize(),
                        tuples: [
                            (() => {
                                const tuple = MetadataTuple.create({
                                    tags: [],
                                    type: MetadataTupleType.create({
                                        name: `[${m.key.getName()}, ${m.value.getName()}]`,
                                        index: null,
                                        recursive: false,
                                        nullables: [],
                                        elements: [m.key, m.value],
                                    }),
                                });
                                tuple.type.of_map = true;
                                return tuple;
                            })(),
                        ],
                    }),
                }),
            }),
        },
        parameters: props.parameters,
        input: props.input,
        definitions: props.maps,
        explore: props.explore,
    });
})(UnionExplorer || (UnionExplorer = {}));

export { UnionExplorer };
//# sourceMappingURL=UnionExplorer.mjs.map
