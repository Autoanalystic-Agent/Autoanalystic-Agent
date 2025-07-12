import ts from 'typescript';
import { MetadataCollection } from '../../../factories/MetadataCollection.mjs';
import { MetadataFactory } from '../../../factories/MetadataFactory.mjs';
import { TransformerError } from '../../TransformerError.mjs';

var ReflectNameTransformer;
(function (ReflectNameTransformer) {
    ReflectNameTransformer.transform = (props) => {
        if (!props.expression.typeArguments?.length)
            throw new TransformerError({
                code: "typia.reflect.metadata",
                message: "no generic argument.",
            });
        const top = props.expression.typeArguments[0];
        const regular = (() => {
            // CHECK SECOND ARGUMENT EXISTENCE
            const second = props.expression.typeArguments[1];
            if (second === undefined)
                return false;
            // GET BOOLEAN VALUE
            const value = getMetadata({
                context: props.context,
                node: second,
            });
            return value.size() === 1 &&
                value.constants.length === 1 &&
                value.constants[0].type === "boolean" &&
                value.constants[0].values.length === 1
                ? value.constants[0].values[0].value
                : false;
        })();
        // RETURNS NAME
        return ts.factory.createStringLiteral(regular
            ? getMetadata({
                context: props.context,
                node: top,
            }).getName()
            : top.getFullText());
    };
})(ReflectNameTransformer || (ReflectNameTransformer = {}));
const getMetadata = (props) => {
    const type = props.context.checker.getTypeFromTypeNode(props.node);
    const collection = new MetadataCollection({
        replace: MetadataCollection.replace,
    });
    const result = MetadataFactory.analyze({
        checker: props.context.checker,
        transformer: props.context.transformer,
        options: {
            absorb: false,
            constant: true,
            escape: false,
        },
        collection,
        type,
    });
    if (result.success === false)
        throw TransformerError.from({
            code: "typia.reflect.name",
            errors: result.errors,
        });
    return result.data;
};

export { ReflectNameTransformer };
//# sourceMappingURL=ReflectNameTransformer.mjs.map
