import ts from 'typescript';
import { LiteralFactory } from '../../../factories/LiteralFactory.mjs';
import { MetadataCollection } from '../../../factories/MetadataCollection.mjs';
import { MetadataFactory } from '../../../factories/MetadataFactory.mjs';
import { JsonSchemaProgrammer } from '../../../programmers/json/JsonSchemaProgrammer.mjs';
import { JsonSchemasProgrammer } from '../../../programmers/json/JsonSchemasProgrammer.mjs';
import { TransformerError } from '../../TransformerError.mjs';

var JsonSchemaTransformer;
(function (JsonSchemaTransformer) {
    JsonSchemaTransformer.transform = (props) => {
        if (!props.expression.typeArguments?.length)
            throw new TransformerError({
                code: "typia.json.schema",
                message: "no generic argument.",
            });
        //----
        // GET ARGUMENTS
        //----
        // VALIDATE TUPLE ARGUMENTS
        const top = props.expression.typeArguments[0];
        if (top === undefined || ts.isTypeNode(top) === false)
            return props.expression;
        // GET TYPES
        const type = props.context.checker.getTypeFromTypeNode(top);
        if (type.isTypeParameter())
            throw new TransformerError({
                code: "typia.json.schema",
                message: "non-specified generic argument.",
            });
        // ADDITIONAL PARAMETERS
        const version = getParameter({
            checker: props.context.checker,
            name: "Version",
            is: (str) => str === "3.0" || str === "3.1",
            cast: (str) => str,
            default: () => "3.1",
        })(props.expression.typeArguments[1]);
        //----
        // GENERATORS
        //----
        // METADATA
        const analyze = (validate) => {
            const results = MetadataFactory.analyze({
                checker: props.context.checker,
                transformer: props.context.transformer,
                options: {
                    absorb: validate,
                    constant: true,
                    escape: true,
                    validate: validate === true ? JsonSchemasProgrammer.validate : undefined,
                },
                collection: new MetadataCollection({
                    replace: MetadataCollection.replace,
                }),
                type,
            });
            if (results.success === false)
                throw TransformerError.from({
                    code: "typia.json.schema",
                    errors: results.errors,
                });
            return results.data;
        };
        analyze(true);
        // APPLICATION
        const app = JsonSchemaProgrammer.write({
            version,
            metadata: analyze(false),
        });
        return ts.factory.createAsExpression(LiteralFactory.write(app), props.context.importer.type({
            file: "typia",
            name: "IJsonSchemaUnit",
            arguments: [
                ts.factory.createLiteralTypeNode(ts.factory.createStringLiteral(version)),
            ],
        }));
    };
    const getParameter = (props) => (node) => {
        if (!node)
            return props.default();
        // CHECK LITERAL TYPE
        const type = props.checker.getTypeFromTypeNode(node);
        if (!type.isLiteral() &&
            (type.getFlags() & ts.TypeFlags.BooleanLiteral) === 0)
            throw new TransformerError({
                code: "typia.json.schema",
                message: `generic argument "${props.name}" must be constant.`,
            });
        // GET VALUE AND VALIDATE IT
        const value = type.isLiteral()
            ? type.value
            : props.checker.typeToString(type);
        if (typeof value !== "string" || props.is(value) === false)
            throw new TransformerError({
                code: "typia.json.schema",
                message: `invalid value on generic argument "${props.name}".`,
            });
        return props.cast(value);
    };
})(JsonSchemaTransformer || (JsonSchemaTransformer = {}));

export { JsonSchemaTransformer };
//# sourceMappingURL=JsonSchemaTransformer.mjs.map
