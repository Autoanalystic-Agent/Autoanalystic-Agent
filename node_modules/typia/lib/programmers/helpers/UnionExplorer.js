"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnionExplorer = void 0;
const typescript_1 = __importDefault(require("typescript"));
const ExpressionFactory_1 = require("../../factories/ExpressionFactory");
const IdentifierFactory_1 = require("../../factories/IdentifierFactory");
const Metadata_1 = require("../../schemas/metadata/Metadata");
const MetadataArray_1 = require("../../schemas/metadata/MetadataArray");
const MetadataArrayType_1 = require("../../schemas/metadata/MetadataArrayType");
const MetadataTuple_1 = require("../../schemas/metadata/MetadataTuple");
const MetadataTupleType_1 = require("../../schemas/metadata/MetadataTupleType");
const check_union_array_like_1 = require("../internal/check_union_array_like");
const UnionPredicator_1 = require("./UnionPredicator");
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
        const specList = UnionPredicator_1.UnionPredicator.object(props.objects);
        if (specList.length === 0) {
            const condition = props.config.objector.unionizer({
                objects: props.objects,
                input: props.input,
                explore: Object.assign(Object.assign({}, props.explore), { tracable: false }),
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
            var _a;
            const key = spec.property.key.getSoleLiteral();
            const accessor = IdentifierFactory_1.IdentifierFactory.access(props.input, key);
            const pred = spec.neighbor
                ? props.config.objector.checker({
                    input: accessor,
                    metadata: spec.property.value,
                    explore: Object.assign(Object.assign({}, props.explore), { tracable: false, postfix: IdentifierFactory_1.IdentifierFactory.postfix(key) }),
                })
                : (props.config.objector.required || ((exp) => exp))(ExpressionFactory_1.ExpressionFactory.isRequired(accessor));
            return typescript_1.default.factory.createIfStatement((props.config.objector.is || ((exp) => exp))(pred), typescript_1.default.factory.createReturnStatement(props.config.objector.decoder({
                object: spec.object,
                input: props.input,
                explore: props.explore,
            })), i === array.length - 1
                ? remained.length
                    ? typescript_1.default.factory.createReturnStatement(UnionExplorer.object({
                        config: props.config,
                        level: ((_a = props.level) !== null && _a !== void 0 ? _a : 0) + 1,
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
            .reduce((a, b) => typescript_1.default.factory.createIfStatement(b.expression, b.thenStatement, a));
        // RETURNS WITH CONDITIONS
        return typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createArrowFunction(undefined, undefined, [], undefined, undefined, typescript_1.default.factory.createBlock([condition], true)), undefined, undefined);
    };
    /* -----------------------------------------------------------
          ARRAY LIKE
      ----------------------------------------------------------- */
    UnionExplorer.tuple = (props) => (0, check_union_array_like_1.check_union_array_like)({
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
    UnionExplorer.array = (props) => (0, check_union_array_like_1.check_union_array_like)({
        config: props.config,
        accessor: {
            transform: (x) => x,
            element: (x) => x.type.value,
            size: (input) => IdentifierFactory_1.IdentifierFactory.access(input, "length"),
            front: (input) => typescript_1.default.factory.createElementAccessExpression(input, 0),
            array: (input) => input,
            name: (t) => t.type.name,
        },
        parameters: props.parameters,
        input: props.input,
        definitions: props.arrays,
        explore: props.explore,
    });
    UnionExplorer.array_or_tuple = (props) => (0, check_union_array_like_1.check_union_array_like)({
        config: props.config,
        accessor: {
            transform: (x) => x,
            element: (x) => (x instanceof MetadataArray_1.MetadataArray ? x.type.value : x),
            size: (input) => IdentifierFactory_1.IdentifierFactory.access(input, "length"),
            front: (input) => typescript_1.default.factory.createElementAccessExpression(input, 0),
            array: (input) => input,
            name: (m) => m.type.name,
        },
        parameters: props.parameters,
        input: props.input,
        definitions: props.definitions,
        explore: props.explore,
    });
    UnionExplorer.set = (props) => (0, check_union_array_like_1.check_union_array_like)({
        config: props.config,
        accessor: {
            transform: (value) => MetadataArray_1.MetadataArray.create({
                tags: [],
                type: MetadataArrayType_1.MetadataArrayType.create({
                    name: `Set<${value.getName()}>`,
                    index: null,
                    recursive: false,
                    nullables: [],
                    value,
                }),
            }),
            element: (array) => array.type.value,
            size: (input) => IdentifierFactory_1.IdentifierFactory.access(input, "size"),
            front: (input) => IdentifierFactory_1.IdentifierFactory.access(typescript_1.default.factory.createCallExpression(IdentifierFactory_1.IdentifierFactory.access(typescript_1.default.factory.createCallExpression(IdentifierFactory_1.IdentifierFactory.access(input, "values"), undefined, undefined), "next"), undefined, undefined), "value"),
            array: (input) => typescript_1.default.factory.createArrayLiteralExpression([typescript_1.default.factory.createSpreadElement(input)], false),
            name: (_m, e) => `Set<${e.getName()}>`,
        },
        parameters: props.parameters,
        input: props.input,
        definitions: props.sets.map((s) => s.value),
        explore: props.explore,
    });
    UnionExplorer.map = (props) => (0, check_union_array_like_1.check_union_array_like)({
        config: props.config,
        accessor: {
            element: (array) => array.type.value.tuples[0].type.elements,
            size: (input) => IdentifierFactory_1.IdentifierFactory.access(input, "size"),
            front: (input) => IdentifierFactory_1.IdentifierFactory.access(typescript_1.default.factory.createCallExpression(IdentifierFactory_1.IdentifierFactory.access(typescript_1.default.factory.createCallExpression(IdentifierFactory_1.IdentifierFactory.access(input, "entries"), undefined, undefined), "next"), undefined, undefined), "value"),
            array: (input) => typescript_1.default.factory.createArrayLiteralExpression([typescript_1.default.factory.createSpreadElement(input)], false),
            name: (_m, [k, v]) => `Map<${k.getName()}, ${v.getName()}>`,
            transform: (m) => MetadataArray_1.MetadataArray.create({
                tags: [],
                type: MetadataArrayType_1.MetadataArrayType.create({
                    name: `Map<${m.key.getName()}, ${m.value.getName()}>`,
                    index: null,
                    recursive: false,
                    nullables: [],
                    value: Metadata_1.Metadata.create(Object.assign(Object.assign({}, Metadata_1.Metadata.initialize()), { tuples: [
                            (() => {
                                const tuple = MetadataTuple_1.MetadataTuple.create({
                                    tags: [],
                                    type: MetadataTupleType_1.MetadataTupleType.create({
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
                        ] })),
                }),
            }),
        },
        parameters: props.parameters,
        input: props.input,
        definitions: props.maps,
        explore: props.explore,
    });
})(UnionExplorer || (exports.UnionExplorer = UnionExplorer = {}));
//# sourceMappingURL=UnionExplorer.js.map