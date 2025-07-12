import ts from 'typescript';
import { ExpressionFactory } from '../../factories/ExpressionFactory.mjs';
import { IdentifierFactory } from '../../factories/IdentifierFactory.mjs';
import { LiteralFactory } from '../../factories/LiteralFactory.mjs';
import { Metadata } from '../../schemas/metadata/Metadata.mjs';
import { MetadataArray } from '../../schemas/metadata/MetadataArray.mjs';
import { MetadataArrayType } from '../../schemas/metadata/MetadataArrayType.mjs';
import { MetadataTuple } from '../../schemas/metadata/MetadataTuple.mjs';
import { MetadataTupleType } from '../../schemas/metadata/MetadataTupleType.mjs';
import { Escaper } from '../../utils/Escaper.mjs';

var RandomJoiner;
(function (RandomJoiner) {
    RandomJoiner.array = (props) => {
        const call = ts.factory.createCallExpression(props.expression, undefined, [
            ts.factory.createObjectLiteralExpression([
                ...(props.schema
                    ? Object.entries(props.schema)
                        .filter(([key]) => key !== "items")
                        .map(([key, value]) => ts.factory.createPropertyAssignment(IdentifierFactory.identifier(key), LiteralFactory.write(value)))
                    : []),
                ...(props.schema
                    ? []
                    : [
                        ts.factory.createSpreadAssignment(ts.factory.createIdentifier("_schema")),
                    ]),
                ts.factory.createPropertyAssignment("element", ts.factory.createArrowFunction(undefined, undefined, [], undefined, undefined, props.decode(props.array.value))),
            ], true),
        ]);
        if (props.recursive === false)
            return call;
        return ts.factory.createConditionalExpression(ts.factory.createGreaterThanEquals(ExpressionFactory.number(5), ts.factory.createIdentifier("_depth")), undefined, call, undefined, ts.factory.createArrayLiteralExpression([]));
    };
    RandomJoiner.tuple = (props) => ts.factory.createArrayLiteralExpression(props.elements.map((elem) => props.decode(elem.rest ?? elem)), true);
    RandomJoiner.object = (props) => {
        if (props.object.properties.length === 0)
            return LiteralFactory.write({});
        // LIST UP PROPERTIES
        const regular = props.object.properties.filter((p) => p.key.isSoleLiteral());
        const dynamic = props.object.properties.filter((p) => !p.key.isSoleLiteral());
        return ts.factory.createObjectLiteralExpression([
            ...regular.map((p) => {
                const str = p.key.getSoleLiteral();
                return ts.factory.createPropertyAssignment(Escaper.variable(str) ? str : ts.factory.createStringLiteral(str), props.decode(p.value));
            }),
            ...dynamic.map((property) => ts.factory.createSpreadAssignment(dynamicProperty({
                decode: props.decode,
                property: property,
            }))),
        ], true);
    };
    const dynamicProperty = (props) => {
        const tuple = MetadataTuple.create({
            type: MetadataTupleType.create({
                name: `[${props.property.key.getName()}, ${props.property.value.getName()}]`,
                elements: [props.property.key, props.property.value],
                index: null,
                recursive: false,
                nullables: [false],
            }),
            tags: [],
        });
        const array = MetadataArray.create({
            type: MetadataArrayType.create({
                name: `Array<[${props.property.key.getName()}, ${props.property.value.getName()}]>`,
                value: Metadata.create({
                    ...Metadata.initialize(),
                    tuples: [tuple],
                }),
                nullables: [false],
                recursive: false,
                index: null,
            }),
            tags: [[]],
        });
        return ts.factory.createCallExpression(IdentifierFactory.access(ts.factory.createIdentifier("Object"), "fromEntries"), undefined, [
            props.decode(Metadata.create({
                ...Metadata.initialize(),
                arrays: [array],
            })),
        ]);
    };
})(RandomJoiner || (RandomJoiner = {}));

export { RandomJoiner };
//# sourceMappingURL=RandomJoiner.mjs.map
