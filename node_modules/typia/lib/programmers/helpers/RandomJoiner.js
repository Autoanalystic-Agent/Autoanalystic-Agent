"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RandomJoiner = void 0;
const typescript_1 = __importDefault(require("typescript"));
const ExpressionFactory_1 = require("../../factories/ExpressionFactory");
const IdentifierFactory_1 = require("../../factories/IdentifierFactory");
const LiteralFactory_1 = require("../../factories/LiteralFactory");
const Metadata_1 = require("../../schemas/metadata/Metadata");
const MetadataArray_1 = require("../../schemas/metadata/MetadataArray");
const MetadataArrayType_1 = require("../../schemas/metadata/MetadataArrayType");
const MetadataTuple_1 = require("../../schemas/metadata/MetadataTuple");
const MetadataTupleType_1 = require("../../schemas/metadata/MetadataTupleType");
const Escaper_1 = require("../../utils/Escaper");
var RandomJoiner;
(function (RandomJoiner) {
    RandomJoiner.array = (props) => {
        const call = typescript_1.default.factory.createCallExpression(props.expression, undefined, [
            typescript_1.default.factory.createObjectLiteralExpression([
                ...(props.schema
                    ? Object.entries(props.schema)
                        .filter(([key]) => key !== "items")
                        .map(([key, value]) => typescript_1.default.factory.createPropertyAssignment(IdentifierFactory_1.IdentifierFactory.identifier(key), LiteralFactory_1.LiteralFactory.write(value)))
                    : []),
                ...(props.schema
                    ? []
                    : [
                        typescript_1.default.factory.createSpreadAssignment(typescript_1.default.factory.createIdentifier("_schema")),
                    ]),
                typescript_1.default.factory.createPropertyAssignment("element", typescript_1.default.factory.createArrowFunction(undefined, undefined, [], undefined, undefined, props.decode(props.array.value))),
            ], true),
        ]);
        if (props.recursive === false)
            return call;
        return typescript_1.default.factory.createConditionalExpression(typescript_1.default.factory.createGreaterThanEquals(ExpressionFactory_1.ExpressionFactory.number(5), typescript_1.default.factory.createIdentifier("_depth")), undefined, call, undefined, typescript_1.default.factory.createArrayLiteralExpression([]));
    };
    RandomJoiner.tuple = (props) => typescript_1.default.factory.createArrayLiteralExpression(props.elements.map((elem) => { var _a; return props.decode((_a = elem.rest) !== null && _a !== void 0 ? _a : elem); }), true);
    RandomJoiner.object = (props) => {
        if (props.object.properties.length === 0)
            return LiteralFactory_1.LiteralFactory.write({});
        // LIST UP PROPERTIES
        const regular = props.object.properties.filter((p) => p.key.isSoleLiteral());
        const dynamic = props.object.properties.filter((p) => !p.key.isSoleLiteral());
        return typescript_1.default.factory.createObjectLiteralExpression([
            ...regular.map((p) => {
                const str = p.key.getSoleLiteral();
                return typescript_1.default.factory.createPropertyAssignment(Escaper_1.Escaper.variable(str) ? str : typescript_1.default.factory.createStringLiteral(str), props.decode(p.value));
            }),
            ...dynamic.map((property) => typescript_1.default.factory.createSpreadAssignment(dynamicProperty({
                decode: props.decode,
                property: property,
            }))),
        ], true);
    };
    const dynamicProperty = (props) => {
        const tuple = MetadataTuple_1.MetadataTuple.create({
            type: MetadataTupleType_1.MetadataTupleType.create({
                name: `[${props.property.key.getName()}, ${props.property.value.getName()}]`,
                elements: [props.property.key, props.property.value],
                index: null,
                recursive: false,
                nullables: [false],
            }),
            tags: [],
        });
        const array = MetadataArray_1.MetadataArray.create({
            type: MetadataArrayType_1.MetadataArrayType.create({
                name: `Array<[${props.property.key.getName()}, ${props.property.value.getName()}]>`,
                value: Metadata_1.Metadata.create(Object.assign(Object.assign({}, Metadata_1.Metadata.initialize()), { tuples: [tuple] })),
                nullables: [false],
                recursive: false,
                index: null,
            }),
            tags: [[]],
        });
        return typescript_1.default.factory.createCallExpression(IdentifierFactory_1.IdentifierFactory.access(typescript_1.default.factory.createIdentifier("Object"), "fromEntries"), undefined, [
            props.decode(Metadata_1.Metadata.create(Object.assign(Object.assign({}, Metadata_1.Metadata.initialize()), { arrays: [array] }))),
        ]);
    };
})(RandomJoiner || (exports.RandomJoiner = RandomJoiner = {}));
//# sourceMappingURL=RandomJoiner.js.map