import ts from 'typescript';
import { LiteralFactory } from '../../../factories/LiteralFactory.mjs';
import { MetadataCollection } from '../../../factories/MetadataCollection.mjs';
import { MetadataFactory } from '../../../factories/MetadataFactory.mjs';
import { TransformerError } from '../../TransformerError.mjs';

var ReflectMetadataTransformer;
(function (ReflectMetadataTransformer) {
    ReflectMetadataTransformer.transform = (props) => {
        if (!props.expression.typeArguments?.length)
            throw new TransformerError({
                code: "typia.reflect.metadata",
                message: "no generic argument.",
            });
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
                code: "typia.reflect.metadata",
                message: "non-specified generic argument(s).",
            });
        // METADATA
        const collection = new MetadataCollection();
        const metadatas = types.map((type) => {
            const result = MetadataFactory.analyze({
                checker: props.context.checker,
                transformer: props.context.transformer,
                options: {
                    escape: true,
                    constant: true,
                    absorb: true,
                    functional: true,
                },
                collection,
                type,
            });
            if (result.success === false)
                throw TransformerError.from({
                    code: "typia.reflect.metadata",
                    errors: result.errors,
                });
            return result.data;
        });
        // CONVERT TO PRIMITIVE TYPE
        const app = {
            metadatas: metadatas.map((metadata) => metadata.toJSON()),
            components: collection.toJSON(),
        };
        return LiteralFactory.write(app);
    };
})(ReflectMetadataTransformer || (ReflectMetadataTransformer = {}));

export { ReflectMetadataTransformer };
//# sourceMappingURL=ReflectMetadataTransformer.mjs.map
