import ts from 'typescript';
import { ExpressionFactory } from '../../factories/ExpressionFactory.mjs';
import { MetadataCollection } from '../../factories/MetadataCollection.mjs';
import { MetadataFactory } from '../../factories/MetadataFactory.mjs';
import { TransformerError } from '../../transformers/TransformerError.mjs';

var MiscLiteralsProgrammer;
(function (MiscLiteralsProgrammer) {
    MiscLiteralsProgrammer.write = (props) => {
        const result = MetadataFactory.analyze({
            checker: props.context.checker,
            transformer: props.context.transformer,
            options: {
                escape: true,
                constant: true,
                absorb: true,
                validate: (meta) => {
                    const length = meta.constants
                        .map((c) => c.values.length)
                        .reduce((a, b) => a + b, 0) +
                        meta.atomics.filter((a) => a.type === "boolean").length;
                    if (0 === length)
                        return [ErrorMessages.NO];
                    else if (meta.size() !== length)
                        return [ErrorMessages.ONLY];
                    return [];
                },
            },
            collection: new MetadataCollection(),
            type: props.type,
        });
        if (result.success === false)
            throw TransformerError.from({
                code: `typia.misc.literals`,
                errors: result.errors,
            });
        const metadata = result.data;
        const values = new Set([
            ...metadata.constants.map((c) => c.values.map((v) => v.value)).flat(),
            ...(metadata.atomics.filter((a) => a.type === "boolean").length
                ? [true, false]
                : []),
            ...(metadata.nullable ? [null] : []),
        ]);
        return ts.factory.createAsExpression(ts.factory.createArrayLiteralExpression([...values].map((v) => v === null
            ? ts.factory.createNull()
            : typeof v === "boolean"
                ? v
                    ? ts.factory.createTrue()
                    : ts.factory.createFalse()
                : typeof v === "number"
                    ? ExpressionFactory.number(v)
                    : typeof v === "bigint"
                        ? ExpressionFactory.bigint(Number(v))
                        : ts.factory.createStringLiteral(v)), true), ts.factory.createTypeReferenceNode("const"));
    };
})(MiscLiteralsProgrammer || (MiscLiteralsProgrammer = {}));
var ErrorMessages;
(function (ErrorMessages) {
    ErrorMessages["NO"] = "no constant literal type found.";
    ErrorMessages["ONLY"] = "only constant literal types are allowed.";
})(ErrorMessages || (ErrorMessages = {}));

export { MiscLiteralsProgrammer };
//# sourceMappingURL=MiscLiteralsProgrammer.mjs.map
