import ts from 'typescript';
import { TransformerError } from '../TransformerError.mjs';

var GenericTransformer;
(function (GenericTransformer) {
    GenericTransformer.scalar = (props) => {
        // CHECK PARAMETER
        if (props.expression.arguments.length === 0)
            throw new TransformerError({
                code: `typia.${props.method}`,
                message: `no input value.`,
            });
        // GET TYPE INFO
        const [type, node, generic] = props.expression.typeArguments && props.expression.typeArguments[0]
            ? [
                props.context.checker.getTypeFromTypeNode(props.expression.typeArguments[0]),
                props.expression.typeArguments[0],
                true,
            ]
            : [
                props.context.checker.getTypeAtLocation(props.expression.arguments[0]),
                props.expression.arguments[0],
                false,
            ];
        if (type.isTypeParameter())
            throw new TransformerError({
                code: `typia.${props.method}`,
                message: `non-specified generic argument.`,
            });
        // DO TRANSFORM
        return ts.factory.createCallExpression(props.write({
            context: props.context,
            modulo: props.modulo,
            type,
            name: generic
                ? node.getFullText().trim()
                : getTypeName({
                    checker: props.context.checker,
                    type,
                    node,
                }),
        }), undefined, props.expression.arguments);
    };
    GenericTransformer.factory = (props) => {
        // CHECK GENERIC ARGUMENT EXISTENCE
        if (!props.expression.typeArguments?.[0])
            throw new TransformerError({
                code: `typia.${props.method}`,
                message: `generic argument is not specified.`,
            });
        // GET TYPE INFO
        const node = props.expression.typeArguments[0];
        const type = props.context.checker.getTypeFromTypeNode(node);
        if (type.isTypeParameter())
            throw new TransformerError({
                code: `typia.${props.method}`,
                message: `non-specified generic argument.`,
            });
        // DO TRANSFORM
        return props.write({
            context: props.context,
            modulo: props.modulo,
            type,
            name: node.getFullText().trim(),
            init: props.expression.arguments[0],
        });
    };
    const getTypeName = (props) => props.checker.typeToString(props.type, props.node, ts.TypeFormatFlags.NodeBuilderFlagsMask);
})(GenericTransformer || (GenericTransformer = {}));

export { GenericTransformer };
//# sourceMappingURL=GenericTransformer.mjs.map
