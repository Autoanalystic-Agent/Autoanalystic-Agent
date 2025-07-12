import ts from 'typescript';
import { LiteralFactory } from '../../../factories/LiteralFactory.mjs';
import { MetadataCollection } from '../../../factories/MetadataCollection.mjs';
import { MetadataFactory } from '../../../factories/MetadataFactory.mjs';
import { JsonSchemasProgrammer } from '../../../programmers/json/JsonSchemasProgrammer.mjs';
import { TransformerError } from '../../TransformerError.mjs';

var JsonSchemasTransformer;
(function (JsonSchemasTransformer) {
    JsonSchemasTransformer.transform = (props) => {
        if (!props.expression.typeArguments?.length)
            throw new TransformerError({
                code: "typia.json.schemas",
                message: "no generic argument.",
            });
        //----
        // GET ARGUMENTS
        //----
        // VALIDATE TUPLE ARGUMENTS
        const top = props.expression.typeArguments[0];
        if (!ts.isTupleTypeNode(top))
            return props.expression;
        else if (top.elements.some((child) => !ts.isTypeNode(child)))
            return props.expression;
        // GET TYPES
        const types = top.elements.map((child) => props.context.checker.getTypeFromTypeNode(child));
        if (types.some((t) => t.isTypeParameter()))
            throw new TransformerError({
                code: "typia.json.schemas",
                message: "non-specified generic argument(s).",
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
            const results = types.map((type) => MetadataFactory.analyze({
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
            }));
            const metadatas = [];
            const errors = [];
            for (const r of results) {
                if (r.success === false)
                    errors.push(...r.errors);
                else
                    metadatas.push(r.data);
            }
            if (errors.length)
                throw TransformerError.from({
                    code: "typia.json.schemas",
                    errors,
                });
            return metadatas;
        };
        analyze(true);
        // APPLICATION
        const collection = JsonSchemasProgrammer.write({
            version,
            metadatas: analyze(false),
        });
        return ts.factory.createAsExpression(LiteralFactory.write(collection), props.context.importer.type({
            file: "typia",
            name: "IJsonSchemaCollection",
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
                code: "typia.json.schemas",
                message: `generic argument "${props.name}" must be constant.`,
            });
        // GET VALUE AND VALIDATE IT
        const value = type.isLiteral()
            ? type.value
            : props.checker.typeToString(type);
        if (typeof value !== "string" || props.is(value) === false)
            throw new TransformerError({
                code: "typia.json.schemas",
                message: `invalid value on generic argument "${props.name}".`,
            });
        return props.cast(value);
    };
})(JsonSchemasTransformer || (JsonSchemasTransformer = {}));

export { JsonSchemasTransformer };
//# sourceMappingURL=JsonSchemasTransformer.mjs.map
